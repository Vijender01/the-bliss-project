# 🔥 WINDOWS FIREWALL FIX - Port 5173

**Problem**: Mobile can't access app, but PC can
**Cause**: Windows Firewall is blocking port 5173
**Solution**: Add firewall exception

---

## ⚡ QUICK FIX (3 Steps)

### Step 1: Download Batch File
A file named `FIX_FIREWALL.bat` has been created in your project folder.

### Step 2: Run as Administrator
1. Go to: `e:\2026\food bliss attempt 2\`
2. Right-click: `FIX_FIREWALL.bat`
3. Select: **"Run as administrator"**
4. Click "Yes" when prompted

### Step 3: Reload Mobile Browser
1. Go back to your mobile
2. Open: `http://192.168.29.136:5173/`
3. Hard refresh (swipe down or Ctrl+Shift+R)
4. **App should load now!** ✅

---

## 🔧 MANUAL FIX (If Batch File Doesn't Work)

### Method 1: Using Windows Defender Firewall GUI

**Step 1: Open Windows Defender Firewall**
1. Press: **Win + R**
2. Type: `firewall.cpl`
3. Press: **Enter**

**Step 2: Allow an App Through Firewall**
1. Click: **"Allow an app through firewall"** (left side)
2. Click: **"Change settings"** button
3. Click: **"Allow another app..."** button
4. Click: **"Browse"**

**Step 3: Find Node.js**
1. Navigate to: `C:\Program Files\nodejs\`
2. Select: `node.exe`
3. Click: **"Add"**
4. Click: **"OK"**

**Step 4: Confirm Node.js is Checked**
1. Back on the firewall window
2. Find: `node.exe` in the list
3. Check both: **"Private"** and **"Public"** checkboxes
4. Click: **"OK"**

---

### Method 2: Using Windows Firewall Advanced Security

**Step 1: Open Advanced Firewall**
1. Press: **Win + R**
2. Type: `wf.msc`
3. Press: **Enter**

**Step 2: Create New Rule**
1. Click: **"Inbound Rules"** (left side)
2. Click: **"New Rule..."** (right side)

**Step 3: Port Rule**
1. Select: **"Port"**
2. Click: **"Next"**

**Step 4: Configure Port**
1. Select: **"TCP"**
2. Select: **"Specific local ports"**
3. Type: **`5173`**
4. Click: **"Next"**

**Step 5: Allow Connection**
1. Select: **"Allow the connection"**
2. Click: **"Next"**

**Step 6: Apply to All Profiles**
1. Check: **"Domain"**
2. Check: **"Private"** ✅
3. Check: **"Public"**
4. Click: **"Next"**

**Step 7: Name the Rule**
1. Name: **`Vite Dev Server (Port 5173)`**
2. Description: **`Allow Vite development server for Food Bliss app`**
3. Click: **"Finish"**

---

### Method 3: PowerShell (Admin Required)

**Step 1: Open PowerShell as Administrator**
1. Press: **Win**
2. Type: **`PowerShell`**
3. Right-click: **"Windows PowerShell"**
4. Click: **"Run as administrator"**
5. Click: **"Yes"**

**Step 2: Run Command**
```powershell
New-NetFirewallRule -DisplayName "Vite Dev Server (Port 5173)" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow -Profile Any
```

**Step 3: Verify**
```powershell
Get-NetFirewallRule -DisplayName "*Vite*"
```

Should show the rule you just created.

---

## ✅ VERIFY FIREWALL FIX WORKED

### On Your PC:

**Command 1: Check if rule exists**
```powershell
Get-NetFirewallRule -DisplayName "*Vite*"
```

Should show:
```
Name                : {GUID}
DisplayName         : Vite Dev Server (Port 5173)
Enabled             : True
Direction           : Inbound
```

**Command 2: Test port connectivity**
```powershell
Test-NetConnection -ComputerName 192.168.29.136 -Port 5173
```

Should show:
```
TcpTestSucceeded : True
```

---

## 🔄 RELOAD MOBILE BROWSER

Once firewall is fixed:

### On Your Mobile:

1. Open URL: `http://192.168.29.136:5173/`

2. **Hard Refresh**:
   - **Chrome/Android**: 
     - Menu → Settings → Apps → Chrome → Storage → Clear All Data
     - Or: Swipe down multiple times to refresh
   - **Safari/iOS**: 
     - Swipe down to refresh multiple times
     - Or: Settings → Safari → Clear History and Website Data
   - **Firefox**: 
     - Menu → Settings → Clear private data

3. Wait 2-3 seconds

4. **App should load!** ✅

---

## 🧪 ALTERNATIVE TEST

If mobile still has issues, test on PC first:

### On Your PC Browser:

```
http://192.168.29.136:5173/
```

If it works on PC but not mobile:
1. Mobile and PC on same WiFi? ✓
2. Same WiFi SSID? ✓
3. Firewall rule added? ✓
4. Try different mobile browser (Firefox, Edge)?

---

## 📋 FIREWALL CHECKLIST

After applying fix, verify:

- [ ] Firewall rule "Vite Dev Server" exists
- [ ] Rule is **Enabled** (not disabled)
- [ ] Rule applies to **Inbound** traffic
- [ ] Rule is for **Port 5173**
- [ ] Rule is for **TCP** protocol
- [ ] Rule action is **Allow**
- [ ] Rule applies to: **Private** network profile

---

## 🚨 IF YOU MADE A MISTAKE

### Remove the Rule (if needed)

**Using GUI:**
1. Open: Windows Defender Firewall → Advanced Settings
2. Click: Inbound Rules
3. Find: "Vite Dev Server"
4. Right-click → Delete

**Using PowerShell (Admin):**
```powershell
Remove-NetFirewallRule -DisplayName "Vite Dev Server (Port 5173)"
```

---

## 💡 WHY THIS HAPPENS

Windows Firewall blocks **all incoming connections** by default for security. Since Vite runs as a server listening on port 5173, it needs explicit permission to accept connections from other devices (like your mobile phone).

By adding this rule, you're telling Windows:
> "Allow Node.js (the JavaScript runtime) to accept incoming connections on port 5173"

This is **safe** because:
- ✅ Only for port 5173
- ✅ Only for TCP protocol
- ✅ Only on your local network
- ✅ You control who accesses it

---

## 🆘 STILL NOT WORKING?

### Check Network Connection

Make sure mobile and PC are on **same WiFi**:

**On PC:**
```powershell
ipconfig
```
Look for: Wi-Fi adapter → IPv4 Address

**On Mobile:**
- Settings → WiFi
- Note the WiFi name (SSID)
- Verify it matches your PC's WiFi name

They must be on **exactly the same network**.

---

## 📞 QUICK REFERENCE

| Issue | Solution |
|-------|----------|
| "Site cannot be reached" | Add firewall rule ← YOU ARE HERE |
| "Connection refused" | Check server is running (npm run dev) |
| "Wrong WiFi" | Connect mobile to same WiFi as PC |
| "Wrong IP" | Run `ipconfig` on PC |
| "Port in use" | Restart: Ctrl+C in dev server, then npm run dev |

---

**Status**: Firewall blocking port 5173
**Solution**: Run `FIX_FIREWALL.bat` as administrator
**Expected Result**: Mobile can access app

🍛 **After firewall fix, try mobile browser again!** 🍛
