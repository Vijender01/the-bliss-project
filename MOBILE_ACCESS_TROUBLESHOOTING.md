# 🔧 FOOD BLISS - MOBILE ACCESS TROUBLESHOOTING

**Issue**: Can't access http://192.168.29.136:5173/ from mobile

**Current Status**: ✅ **Dev server is NOW RUNNING**

---

## ✅ SOLUTION: Try These Steps

### Step 1: Verify Your Current IP Address

**On your PC, run this command:**
```powershell
ipconfig
```

**Look for**: "IPv4 Address" under your network adapter

Common patterns:
- `192.168.x.x` (Most common)
- `10.0.x.x` (Also common)
- `172.16.x.x` (Less common)

**Example output:**
```
Ethernet adapter Ethernet:
   IPv4 Address . . . . . . . . . : 192.168.29.136
   Subnet Mask . . . . . . . . . . : 255.255.255.0
```

### Step 2: Get the Correct IP

The IP displayed by Vite is: **192.168.29.136**

Try this URL on your mobile:
```
http://192.168.29.136:5173/
```

### Step 3: Mobile Checklist

Before trying to access, verify:

- [ ] **WiFi Connection**: Mobile is on the same WiFi as PC
  - Don't use mobile hotspot
  - Must be on same network
  - Check WiFi name on mobile

- [ ] **Dev Server Running**: Open PowerShell and run:
  ```powershell
  netstat -ano | findstr :5173
  ```
  Should show: `TCP    0.0.0.0:5173` with a PID

- [ ] **Firewall**: Allow Node.js through Windows Firewall
  - Windows Defender Firewall
  - Allow an app through firewall
  - Check if "node.exe" is allowed

- [ ] **URL Correct**: Type exactly:
  ```
  http://192.168.29.136:5173/
  ```
  (NOT https:// - use http://)

### Step 4: On Mobile Browser

1. Open any browser (Chrome, Safari, Firefox, etc.)
2. Tap the address bar
3. Type: `http://192.168.29.136:5173/`
4. Press Enter
5. Wait 2-3 seconds for app to load

---

## 🔍 DETAILED TROUBLESHOOTING

### Issue: "Can't reach this page"

**Possible Causes & Solutions:**

#### A. Wrong IP Address
```powershell
# Check your actual IP
ipconfig

# Look for IPv4 Address (e.g., 192.168.x.x)
```

**Fix**: Use the correct IP from ipconfig output

#### B. Different WiFi Network
- Mobile on WiFi: "MyNetwork"
- PC on WiFi: "MyNetwork"
- ✅ Same = Will work
- PC on WiFi, Mobile on cellular = Won't work

**Fix**: Connect mobile to same WiFi as PC

#### C. Dev Server Not Running
```powershell
# Check if port 5173 is listening
netstat -ano | findstr :5173

# If nothing shows, server is not running
# Start it with:
npm run dev
```

**Fix**: Start the dev server

#### D. Firewall Blocking
Windows Firewall might block Node.js

**Fix Steps:**
1. Open Windows Defender Firewall
2. Click "Allow an app through firewall"
3. Look for "node.exe"
4. Check both "Private" and "Public"
5. Click OK

#### E. Port 5173 Already in Use
```powershell
# Check what's using port 5173
netstat -ano | findstr :5173

# Kill the process
# Get the PID from above, then:
taskkill /PID <PID> /F
```

**Fix**: Kill the process or use different port

---

## 🌍 ALTERNATIVE ACCESS METHODS

### If 192.168.29.136 doesn't work:

#### Method 1: Use PC Name
```
http://<YOUR-PC-NAME>:5173/

# Example:
http://DELL-LAPTOP:5173/
http://HP-PC:5173/
```

**How to find your PC name:**
- Right-click This PC → Properties
- Look for "Computer name"

#### Method 2: Use localhost (On Same PC)
```
http://localhost:5173/
```
Only works on the PC running the server

#### Method 3: Get Full IP Config
```powershell
ipconfig /all
```

Look for your active network adapter's IPv4 Address

---

## 📋 QUICK DIAGNOSTIC CHECKLIST

Run these commands on your PC:

```powershell
# 1. Check your IP
ipconfig

# 2. Check if dev server is running
netstat -ano | findstr :5173

# 3. Check if port is accessible
Test-NetConnection -ComputerName 192.168.29.136 -Port 5173

# 4. Verify npm is working
npm --version

# 5. Check Node.js is working
node --version
```

---

## 🚀 QUICK FIX STEPS

### If Still Not Working:

**Step 1: Stop the server**
```powershell
# In the terminal running npm run dev, press:
Ctrl+C
```

**Step 2: Check ports**
```powershell
netstat -ano | findstr :5173
```

**Step 3: Kill any process on 5173 (if needed)**
```powershell
# Find the PID from above, then:
taskkill /PID <PID> /F
```

**Step 4: Start fresh**
```powershell
npm run dev
```

**Step 5: Wait for server message**
```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.29.136:5173/
```

**Step 6: Try URL on mobile**
```
http://192.168.29.136:5173/
```

---

## 🔥 FIREWALL SOLUTION (Most Common)

**If everything above works but still can't access:**

Windows Firewall is likely blocking Node.js.

### Fix:

1. **Open Windows Defender Firewall**
   - Press Win key
   - Type: "Windows Defender Firewall"
   - Click "Windows Defender Firewall with Advanced Security"

2. **Click "Inbound Rules"** (left side)

3. **Click "New Rule"** (right side)

4. **Select "Port"** → Next

5. **Select "TCP"** → Port: **5173** → Next

6. **Select "Allow the connection"** → Next

7. **Check "Domain", "Private", "Public"** → Next

8. **Name**: "Vite Dev Server" → Finish

9. **Restart your dev server**:
   ```powershell
   npm run dev
   ```

10. **Try mobile again**

---

## 🆘 STILL NOT WORKING?

### Option A: Try Different Port

Edit `vite.config.js`:
```javascript
export default {
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080  // Change from 5173 to 8080
  }
}
```

Then access: `http://192.168.29.136:8080/`

### Option B: Test on PC First

Make sure it works locally:
```
http://localhost:5173/
```

Open on PC browser and confirm the app loads.

If it works locally but not on mobile = Network/Firewall issue

If it doesn't work on PC = Server issue

### Option C: Check Network Status

```powershell
# See all active connections
Get-NetTCPConnection -State Listen | Select LocalAddress, LocalPort

# See all processes listening
netstat -ab
```

---

## 📱 MOBILE BROWSER TIPS

### Chrome on Android
1. Type URL in address bar
2. Make sure you use `http://` (not `https://`)
3. Press Enter
4. Wait 2-3 seconds

### Safari on iOS
1. Tap address bar
2. Type URL starting with `http://`
3. Tap Go
4. Wait 2-3 seconds

### Firefox Mobile
1. Tap address bar
2. Type `http://192.168.29.136:5173/`
3. Tap search/go
4. Wait for load

---

## ✅ CURRENT SERVER STATUS

**Dev Server**: ✅ RUNNING NOW

```
Vite v5.4.21 ready
Local:   http://localhost:5173/
Network: http://192.168.29.136:5173/
```

**Next Action**: 
1. Verify your IP: `ipconfig`
2. Confirm WiFi: Mobile on same network
3. Open URL on mobile: `http://192.168.29.136:5173/`
4. Wait 2-3 seconds for load

---

## 📞 STILL STUCK?

Try this command to verify everything:

```powershell
# See current network status
ipconfig

# See if server is running
netstat -ano | findstr :5173

# See if port accessible
Test-NetConnection -ComputerName 192.168.29.136 -Port 5173 -InformationLevel Detailed
```

---

**Status**: Dev server is running ✅  
**Next Step**: Verify IP and try on mobile  
**Support**: Check troubleshooting section above

🍛 **You're close! The server is ready.** 🍛
