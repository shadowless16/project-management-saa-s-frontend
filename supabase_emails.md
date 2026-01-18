# Supabase Email Templates

Go to **Authentication > Email Templates** in your Supabase Dashboard and paste these:

## 1. Confirm Signup (Invite)

**Subject**: Confirm your account on TaskFlow

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
      }
      .container {
        padding: 40px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        max-width: 600px;
        margin: 40px auto;
      }
      .button {
        background: #0ea5e9;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        display: inline-block;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to TaskFlow!</h1>
      <p>
        Success! You've been invited to join TaskFlow. Click the button below to
        confirm your account and get started.
      </p>
      <a href="{{ .ConfirmationURL }}" class="button">Confirm Account</a>
      <p style="color: #64748b; font-size: 14px;">
        If you didn't request this, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
```

## 2. Magic Link (OTP / Login Code)

**Subject**: Your TaskFlow Login Code

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
      }
      .container {
        padding: 40px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        max-width: 600px;
        margin: 40px auto;
      }
      .code {
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 4px;
        color: #0ea5e9;
        background: #f0f9ff;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Your Login Code</h1>
      <p>Use the code below to sign in to your TaskFlow account:</p>
      <div class="code">{{ .Token }}</div>
      <p>
        This code will expire in 10 minutes.
        <strong>Do not share this code with anyone.</strong>
      </p>
    </div>
  </body>
</html>
```

## 3. Reset Password

**Subject**: Reset your TaskFlow Password

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family:
          -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
          Arial, sans-serif;
      }
      .container {
        padding: 40px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        max-width: 600px;
        margin: 40px auto;
      }
      .button {
        background: #0ea5e9;
        color: white;
        padding: 12px 24px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        display: inline-block;
        margin: 20px 0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Reset Password</h1>
      <p>
        We received a request to reset your password. Click the button below to
        set a new one:
      </p>
      <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      <p style="color: #64748b; font-size: 14px;">
        If you didn't request this, you can safely ignore this email. Your
        password will remain unchanged.
      </p>
    </div>
  </body>
</html>
```
