# Security Remediation Plan

This implementation plan details the necessary steps to remediate the security vulnerabilities found in the recent audit.

## 1. SSRF and Lack of Input Validation (press-service)
**Vulnerabilities:**
- SSRF in `press-service/src/scraper.js` and `index.js` (POST /feeds).
- Lack of Input Validation in `press-service/src/index.js` (POST /feeds).

**Target Files:**
- `/home/admin_robedwards_altostrat_com/workspace/daily-extraction/press-service/src/index.js`
- `/home/admin_robedwards_altostrat_com/workspace/daily-extraction/press-service/src/scraper.js`

**Code Changes Required:**
1. **Input Validation (index.js):**
   - In `POST /feeds`, validate that `name` is a non-empty string and has a reasonable length (e.g., `< 100` characters).
   - Validate that `url` is a well-formed URL using `new URL(url)`. Ensure the protocol is strictly `http:` or `https:`.
2. **SSRF Mitigation (index.js / scraper.js):**
   - Create a utility function to parse the hostname from the `url` and ensure it does not resolve to a private/internal IP address or localhost (e.g., `127.0.0.1`, `localhost`, `10.x.x.x`, `169.254.169.254`, `192.168.x.x`, `172.16.x.x - 172.31.x.x`).
   - Implement this check before saving the feed in `POST /feeds`.
   - In `scraper.js`, add a secondary check before `parser.parseURL(feed.url)` to prevent scanning internal network resources in case a malicious URL bypassed the initial validation.

**Verification Strategy:**
- Attempt to `POST /feeds` with invalid URLs (e.g., `ftp://malicious.com`, `file:///etc/passwd`, `http://169.254.169.254/latest/meta-data/`). The request should be rejected with a `400 Bad Request`.
- Attempt to `POST /feeds` with empty names or excessively long names; expect `400 Bad Request`.

---

## 2. Broken Access Control (press-service)
**Vulnerability:**
- Broken Access Control in `press-service/src/index.js` (unauthenticated POST /feeds, DELETE /feeds/:id, POST /chaos).

**Target File:**
- `/home/admin_robedwards_altostrat_com/workspace/daily-extraction/press-service/src/index.js`

**Code Changes Required:**
1. **Authentication Middleware:**
   - Implement an Express middleware (e.g., `requireAuth`) that checks for a valid authentication token.
   - For example, check if `req.headers.authorization` equals `Bearer ${process.env.ADMIN_API_KEY}`. If not, return a `401 Unauthorized` or `403 Forbidden` response.
2. **Route Protection:**
   - Apply the `requireAuth` middleware to the following routes:
     - `app.post('/feeds', requireAuth, ...)`
     - `app.delete('/feeds/:id', requireAuth, ...)`
     - `app.post('/chaos', requireAuth, ...)`
     - `app.delete('/chaos', requireAuth, ...)`

**Verification Strategy:**
- Send a `POST /feeds` or `POST /chaos` request without an `Authorization` header. Expect a `401` or `403` status code.
- Provide the correct token in the header and verify that the request succeeds (`201 Created` or `200 OK`).

---

## 3. Insecure CORS (mindset-service & origin-service)
**Vulnerability:**
- Insecure CORS (allow_origins=["*"]) in `mindset-service/main.py` and `origin-service/main.go`.

**Target Files:**
- `/home/admin_robedwards_altostrat_com/workspace/daily-extraction/mindset-service/main.py`
- `/home/admin_robedwards_altostrat_com/workspace/daily-extraction/origin-service/main.go`

**Code Changes Required:**
1. **mindset-service/main.py:**
   - Locate the `CORSMiddleware` configuration.
   - Change `allow_origins=["*"]` to dynamically read from an environment variable (e.g., `os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")`).
2. **origin-service/main.go:**
   - Locate the `enableCORS` middleware function.
   - Change `w.Header().Set("Access-Control-Allow-Origin", "*")` to validate the incoming `Origin` header against an allowed list or an environment variable (e.g., `os.Getenv("ALLOWED_ORIGINS")`). If the origin matches, set it in the header; otherwise, do not set it or set a fallback.

**Verification Strategy:**
- Send an `OPTIONS` request with `Origin: https://malicious-site.com` to both services. Verify that the response does not include `Access-Control-Allow-Origin: https://malicious-site.com` or `*`.
- Send an `OPTIONS` request with a valid `Origin` (e.g., `http://localhost:3000`) and verify that it is properly reflected in the CORS headers.