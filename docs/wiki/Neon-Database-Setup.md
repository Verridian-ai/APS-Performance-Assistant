# Neon Database Setup Guide

> ⏱️ **Estimated Time:** 10-15 minutes
> 📋 **Difficulty:** Beginner (no experience required)
> 💰 **Cost:** Free tier available (0.5 GB storage, no credit card needed)

This guide walks you through setting up a Neon Postgres database for the APS Performance Assistant. Every step includes detailed instructions and screenshots.

---

## 📑 Table of Contents

1. [What is Neon?](#-what-is-neon)
2. [Create Your Account](#step-1-create-your-neon-account)
3. [Verify Your Email](#step-2-verify-your-email)
4. [Create Your First Project](#step-3-create-your-first-project)
5. [Understand the Dashboard](#step-4-understand-the-dashboard)
6. [Get Your Connection String](#step-5-get-your-connection-string)
7. [Add to Your Environment File](#step-6-add-to-your-environment-file)
8. [Verify the Connection](#step-7-verify-the-connection)
9. [Common Issues & Troubleshooting](#-common-issues--troubleshooting)

---

## 🌟 What is Neon?

**Neon** is a fully managed serverless PostgreSQL database service. Think of it as a place where your application stores all its data (users, conversations, settings) in the cloud.

### Why Neon for APS Performance Assistant?

| Benefit | Description |
|---------|-------------|
| ✅ **Free Tier** | 0.5 GB storage free forever, no credit card required |
| ✅ **Serverless** | Automatically turns off when not in use (saves costs) |
| ✅ **Fast Setup** | Database ready in under 2 minutes |
| ✅ **Australian Region** | Sydney data center available for low latency |
| ✅ **Secure** | Built-in SSL encryption for all connections |

---

## Step 1: Create Your Neon Account

### 1.1 Open the Neon Website

1. **Open** your web browser (Chrome, Firefox, Safari, or Edge)
2. **Type** this URL in the address bar: **https://neon.tech**
3. **Press** Enter to navigate to the website

<!-- 📸 SCREENSHOT: neon-01-homepage.png -->
<!-- Caption: Neon homepage showing the main landing page -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/01-homepage.png`
> **What to capture:** The Neon.tech homepage with "Sign Up" button visible

> ✅ **What you should see:** A dark-themed website with "The database you love, on a serverless platform" as the main heading, and a purple/blue "Sign Up" button in the top-right corner.

---

### 1.2 Click Sign Up

4. **Locate** the **"Sign Up"** button in the top-right corner of the page
5. **Click** the **"Sign Up"** button

<!-- 📸 SCREENSHOT: neon-02-signup-button.png -->
<!-- Caption: Arrow pointing to the Sign Up button location -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/02-signup-button.png`
> **What to capture:** Close-up of the Sign Up button with an arrow pointing to it

---

### 1.3 Choose Your Sign-Up Method

You'll see a sign-up modal with multiple options:

| Sign-Up Method | Recommended For | Steps Required |
|----------------|-----------------|----------------|
| 🐙 **GitHub** | Developers | 1-click if already logged into GitHub |
| 🔵 **Google** | Everyone | 1-click if already logged into Google |
| 📧 **Email** | Corporate users | Requires email verification |

6. **Click** your preferred sign-up method

> 💡 **Tip:** We recommend **GitHub** or **Google** for the fastest setup—no password to remember!

<!-- 📸 SCREENSHOT: neon-03-signup-options.png -->
<!-- Caption: Sign-up modal showing GitHub, Google, and Email options -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/03-signup-options.png`
> **What to capture:** The sign-up modal with all three options clearly visible

> ✅ **What you should see:** A modal popup with "Sign up for Neon" heading and three authentication buttons.

---

### 1.4 Authorize Access (GitHub/Google Only)

If you chose GitHub or Google:

7. **Review** the permissions Neon is requesting
8. **Click** "Authorize" or "Allow"

> ⚠️ **Don't worry:** Neon only requests basic profile information (name, email). It cannot access your private repositories or Google Drive files.

<!-- 📸 SCREENSHOT: neon-04-authorize.png -->
<!-- Caption: GitHub/Google authorization screen -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/04-authorize.png`
> **What to capture:** The GitHub or Google authorization dialog

> ✅ **What you should see:** A permissions dialog from your chosen provider asking you to authorize Neon.

---

## Step 2: Verify Your Email

> ℹ️ **Note:** If you signed up with **GitHub** or **Google**, your email is automatically verified. **Skip to Step 3.**

### 2.1 Check Your Inbox

9. **Open** your email application (Gmail, Outlook, etc.)
10. **Look for** an email from **"Neon"** with subject line **"Verify your email address"**
11. **Check** your spam/junk folder if you don't see it

<!-- 📸 SCREENSHOT: neon-05-verification-email.png -->
<!-- Caption: Verification email in inbox -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/05-verification-email.png`
> **What to capture:** The verification email in an inbox

---

### 2.2 Click the Verification Link

12. **Open** the email from Neon
13. **Click** the **"Verify Email"** button (or the verification link)

<!-- 📸 SCREENSHOT: neon-06-email-content.png -->
<!-- Caption: Inside the verification email with button highlighted -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/06-email-content.png`
> **What to capture:** The email content with the "Verify Email" button visible

---

### 2.3 Confirmation

14. Your browser will open to Neon with a success message

> ✅ **What you should see:** "Your email has been verified" message, then redirect to the dashboard.

---

## Step 3: Create Your First Project

After successful sign-up, Neon automatically starts the project creation wizard.

### 3.1 Open the Project Creation Wizard

15. If not automatically shown, **Click** **"New Project"** on the dashboard

<!-- 📸 SCREENSHOT: neon-07-new-project-button.png -->
<!-- Caption: Dashboard with New Project button highlighted -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/07-new-project-button.png`
> **What to capture:** The Neon dashboard with "New Project" button visible

---

### 3.2 Enter Project Name

16. **Click** in the **"Project name"** field
17. **Type:** `aps-performance-assistant`

> 💡 **Explanation:** The project name is just a label for you to identify this database. It doesn't affect how the database works.

<!-- 📸 SCREENSHOT: neon-08-project-name.png -->
<!-- Caption: Project name field with "aps-performance-assistant" entered -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/08-project-name.png`
> **What to capture:** The project name input field filled in

---

### 3.3 Select Your Region

18. **Click** the **"Region"** dropdown menu
19. **Select** **"Asia Pacific (Sydney)"** for Australia

| Region | Best For | Latency to Sydney |
|--------|----------|-------------------|
| 🇦🇺 **Asia Pacific (Sydney)** | Australian users | ~5ms ⭐ |
| 🇺🇸 US East (N. Virginia) | US East Coast users | ~200ms |
| 🇪🇺 Europe (Frankfurt) | European users | ~300ms |

> 💡 **Explanation:** The region is the physical location of the servers storing your data. Choosing Sydney means faster response times for Australian users.

<!-- 📸 SCREENSHOT: neon-09-region-selection.png -->
<!-- Caption: Region dropdown with Sydney highlighted -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/09-region-selection.png`
> **What to capture:** The region dropdown expanded with Sydney option visible

---

### 3.4 Select Postgres Version

20. **Leave** the **Postgres Version** at the default: **16** (or latest)

> 💡 **Explanation:** Postgres version is the database software version. Version 16 is the latest stable release with the best features. Always use the latest unless you have a specific reason not to.

---

### 3.5 Create the Project

21. **Review** your settings:
    - Project name: `aps-performance-assistant`
    - Region: `Asia Pacific (Sydney)`
    - Postgres version: `16`

22. **Click** the **"Create Project"** button

<!-- 📸 SCREENSHOT: neon-10-create-project.png -->
<!-- Caption: Filled form with Create Project button highlighted -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/10-create-project.png`
> **What to capture:** Complete form ready to submit with all fields filled

> ⏳ **Wait:** Project creation takes 10-30 seconds. You'll see a loading spinner.

> ✅ **What you should see:** A success message and redirect to your new project dashboard.

---

## Step 4: Understand the Dashboard

After creating your project, you'll see the project dashboard.

### 4.1 Dashboard Overview

<!-- 📸 SCREENSHOT: neon-11-dashboard-overview.png -->
<!-- Caption: Annotated dashboard with key areas labeled -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/11-dashboard-overview.png`
> **What to capture:** Full dashboard with annotations pointing to: Connection Details, Branch selector, Sidebar menu

### Key Areas of the Dashboard

| Area | Purpose |
|------|---------|
| **Connection Details** | Your database connection string (we need this!) |
| **Branch Selector** | For managing database branches (ignore for now) |
| **Tables** | View and manage database tables |
| **SQL Editor** | Run SQL queries directly |
| **Settings** | Project configuration |

---

## Step 5: Get Your Connection String

This is the most important step! The connection string tells your application how to connect to the database.

### 5.1 Locate the Connection Details

23. **Look** for the **"Connection Details"** section on the dashboard (usually top-right or center)

<!-- 📸 SCREENSHOT: neon-12-connection-section.png -->
<!-- Caption: Connection Details section highlighted -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/12-connection-section.png`
> **What to capture:** The Connection Details panel on the dashboard

---

### 5.2 Select Connection Type

24. **Ensure** the connection type dropdown shows **"Pooled connection"**

> 💡 **Explanation:**
> - **Pooled connection**: Reuses database connections (better for serverless apps) ✅
> - **Direct connection**: Creates new connections each time (use for migrations)

<!-- 📸 SCREENSHOT: neon-13-pooled-toggle.png -->
<!-- Caption: Connection type dropdown with Pooled selected -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/13-pooled-toggle.png`
> **What to capture:** Dropdown showing "Pooled connection" selected

---

### 5.3 Copy the Connection String

25. **Locate** the connection string field (starts with `postgres://` or `postgresql://`)
26. **Click** the **copy icon** (📋) next to the connection string

<!-- 📸 SCREENSHOT: neon-14-copy-string.png -->
<!-- Caption: Connection string with copy button highlighted -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/14-copy-string.png`
> **What to capture:** The connection string with copy button clearly visible

> ✅ **What you should see:** A tooltip saying "Copied!" or a brief animation.

### Connection String Format

Your connection string looks like this:

```
postgres://neondb_owner:AbC123XyZ@ep-cool-night-123456.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
└──────┘ └───────────┘ └────────┘ └──────────────────────────────────────────────────┘└─────┘└─────────────────┘
Protocol   Username     Password                     Host (endpoint)                  Database   SSL Mode
```

| Part | Example | Description |
|------|---------|-------------|
| Protocol | `postgres://` | Database type |
| Username | `neondb_owner` | Your database user |
| Password | `AbC123XyZ` | Your secret password |
| Host | `ep-cool-night-123456.ap-southeast-2.aws.neon.tech` | Server address |
| Database | `neondb` | Database name |
| SSL Mode | `sslmode=require` | Security setting |

> ⚠️ **SECURITY WARNING:** Your connection string contains your password!
> - ❌ Never share it publicly
> - ❌ Never commit it to Git
> - ❌ Never post it in forums or screenshots
> - ✅ Always store it in environment variables

---

## Step 6: Add to Your Environment File

Now we'll save the connection string in your application's configuration.

### 6.1 Open Your Project in a Code Editor

27. **Open** VS Code (or your preferred editor)
28. **Open** the APS Performance Assistant project folder

---

### 6.2 Locate or Create the .env File

29. **Look** for a file named `.env` in the `backend/` folder
30. If it doesn't exist, **create** a new file named `.env`

<!-- 📸 SCREENSHOT: neon-15-env-file-location.png -->
<!-- Caption: VS Code file explorer showing .env file location -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/15-env-file-location.png`
> **What to capture:** VS Code with file explorer showing backend folder and .env file

---

### 6.3 Modify the Connection String

**IMPORTANT:** Before pasting, you must change the protocol!

31. **Change** `postgres://` to `postgresql+asyncpg://`

**Before (what you copied):**
```
postgres://neondb_owner:password@ep-example.neon.tech/neondb?sslmode=require
```

**After (what you need):**
```
postgresql+asyncpg://neondb_owner:password@ep-example.neon.tech/neondb?sslmode=require
```

> 💡 **Why?** The APS Performance Assistant uses SQLAlchemy with asyncpg driver. This requires the `postgresql+asyncpg://` prefix.

---

### 6.4 Paste into .env File

32. **Open** the `.env` file
33. **Add** or **update** the DATABASE_URL line:

```env
# Database Configuration
DATABASE_URL=postgresql+asyncpg://neondb_owner:YOUR_PASSWORD@ep-your-endpoint.ap-southeast-2.aws.neon.tech/neondb?sslmode=require
```

**Complete .env Example:**
```env
# ======================
# Database (Neon Postgres)
# ======================
DATABASE_URL=postgresql+asyncpg://neondb_owner:AbC123XyZ@ep-cool-night-123456.ap-southeast-2.aws.neon.tech/neondb?sslmode=require

# ======================
# OpenAI API
# ======================
OPENAI_API_KEY=sk-your-key-here

# ======================
# Authentication
# ======================
SECRET_KEY=your-random-secret-key
```

34. **Save** the file (Ctrl+S / Cmd+S)

<!-- 📸 SCREENSHOT: neon-16-env-complete.png -->
<!-- Caption: Complete .env file with connection string filled in -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/16-env-complete.png`
> **What to capture:** The .env file open in VS Code with DATABASE_URL filled in

---

## Step 7: Verify the Connection

Let's make sure everything works!

### 7.1 Start the Backend Server

35. **Open** a terminal in VS Code (Terminal → New Terminal)
36. **Navigate** to the backend folder:
    ```bash
    cd backend
    ```
37. **Activate** the virtual environment:
    ```bash
    # Windows:
    .\venv\Scripts\activate

    # Mac/Linux:
    source venv/bin/activate
    ```
38. **Start** the server:
    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

---

### 7.2 Check for Success

39. **Look** for these messages in the terminal:

```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
✓ Database connected successfully
✓ Tables verified: users, profiles, preferences
```

> ✅ **Success!** If you see "Application startup complete" without errors, your database is connected!

<!-- 📸 SCREENSHOT: neon-17-success-terminal.png -->
<!-- Caption: Terminal showing successful startup messages -->
> **📸 Screenshot Placeholder:** `docs/screenshots/neon/17-success-terminal.png`
> **What to capture:** Terminal with successful startup messages

---

### 7.3 Test the Health Endpoint

40. **Open** your browser
41. **Navigate** to: `http://localhost:8000/health`
42. **Look** for a JSON response like:
    ```json
    {
      "status": "healthy",
      "database": "connected"
    }
    ```

---

## 🔧 Common Issues & Troubleshooting

### Issue 1: "Connection Refused" Error

```
sqlalchemy.exc.OperationalError: connection refused
```

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Wrong host/endpoint | Double-check the endpoint in your connection string |
| Firewall blocking | Check if your network blocks port 5432 |
| VPN interference | Try disconnecting from VPN |

---

### Issue 2: "SSL Certificate Verify Failed"

```
ssl.SSLCertVerificationError: certificate verify failed
```

**Solution:**
Ensure your connection string ends with `?sslmode=require`:
```
...neon.tech/neondb?sslmode=require
```

---

### Issue 3: "Password Authentication Failed"

```
asyncpg.exceptions.InvalidPasswordError: password authentication failed
```

**Causes & Solutions:**

| Cause | Solution |
|-------|----------|
| Typo in password | Re-copy the connection string from Neon |
| Special characters | If password has `@` or `#`, URL-encode them |
| Password reset | Reset password in Neon Console → Roles |

**URL Encoding for Special Characters:**

| Character | Encoded As |
|-----------|------------|
| `@` | `%40` |
| `#` | `%23` |
| `:` | `%3A` |
| `/` | `%2F` |

---

### Issue 4: "Database Does Not Exist"

```
asyncpg.exceptions.InvalidCatalogNameError: database "wrongdb" does not exist
```

**Solution:**
The database name should be `neondb` (the default). Check the end of your connection string:
```
.../neondb?sslmode=require
     ^^^^^^
     Should be "neondb"
```

---

### Issue 5: "No Module Named asyncpg"

```
ModuleNotFoundError: No module named 'asyncpg'
```

**Solution:**
Install the missing package:
```bash
pip install asyncpg
```

---

## ✅ Verification Checklist

Before moving on, confirm:

- [ ] Neon account created
- [ ] Project created in Sydney region
- [ ] Connection string copied
- [ ] Changed `postgres://` to `postgresql+asyncpg://`
- [ ] Added to `.env` file
- [ ] Backend starts without errors
- [ ] Health endpoint returns "healthy"

---

## 🎉 Congratulations!

You've successfully set up your Neon database! Your APS Performance Assistant can now store:
- User accounts
- Chat conversations
- Performance goals
- Session data

**Next Step:** [[OpenAI-Setup|Set up your OpenAI API Key →]]
