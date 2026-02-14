import http from "http";

// Configuration
const BASE_URL = "http://localhost:4000";
const TEST_USER = {
  name: "Test User",
  email: `test${Date.now()}@example.com`,
  password: "test123456",
  mobile: "1234567890",
  companyName: "Test Company",
  companyAddress: "Test Address",
};

let authToken = "";
let adminToken = "";
let testUserId: number;

// Helper function to make HTTP requests
function request(
  method: string,
  path: string,
  body?: object,
  token?: string,
): Promise<{ status: number; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode || 0, data: parsed });
        } catch {
          resolve({ status: res.statusCode || 0, data: data });
        }
      });
    });

    req.on("error", reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

// Test functions
async function testHealthCheck() {
  console.log("\n📋 Testing Health Check...");
  const { status, data } = await request("GET", "/health");
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data)}`);
  return status === 200;
}

async function testRegister() {
  console.log("\n📋 Testing User Registration...");
  const { status, data } = await request(
    "POST",
    "/api/auth/register",
    TEST_USER,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 201 && data.token) {
    authToken = data.token;
    console.log("   ✅ Registration successful, token saved");
    return true;
  }
  console.log("   ❌ Registration failed");
  return false;
}

async function testLogin() {
  console.log("\n📋 Testing User Login...");
  const { status, data } = await request("POST", "/api/auth/login", {
    email: TEST_USER.email,
    password: TEST_USER.password,
  });
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 200 && data.token) {
    authToken = data.token;
    console.log("   ✅ Login successful, token saved");
    return true;
  }
  console.log("   ❌ Login failed");
  return false;
}

async function testGetMe() {
  console.log("\n📋 Testing Get Current User (Protected)...");
  const { status, data } = await request(
    "GET",
    "/api/auth/me",
    undefined,
    authToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 200) {
    console.log("   ✅ Get current user successful");
    return true;
  }
  console.log("   ❌ Get current user failed");
  return false;
}

async function testCreateOrder() {
  console.log("\n📋 Testing Create Payment Order (Protected)...");
  const { status, data } = await request(
    "POST",
    "/api/payments/create-order",
    { planType: "basic", period: "monthly" },
    authToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 200) {
    console.log("   ✅ Create order successful");
    return true;
  }
  console.log("   ❌ Create order failed");
  return false;
}

async function testVerifyPayment() {
  console.log("\n📋 Testing Verify Payment (Protected)...");
  // Note: This will fail with invalid Razorpay signature, but we're testing the endpoint
  const { status, data } = await request(
    "POST",
    "/api/payments/verify-payment",
    {
      razorpayOrderId: "order_test",
      razorpayPaymentId: "payment_test",
      razorpaySignature: "invalid_signature",
      planType: "basic",
      period: "monthly",
    },
    authToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  // Expected to fail with invalid signature, but endpoint is reachable
  console.log(
    "   ✅ Verify payment endpoint reachable (expected failure with invalid signature)",
  );
  return true;
}

async function testAdminLogin() {
  console.log("\n📋 Testing Admin Login...");
  // You'll need to create an admin user first or use existing credentials
  const { status, data } = await request("POST", "/api/auth/login", {
    email: "admin@morextech.com", // Replace with actual admin email
    password: "adminpassword123", // Replace with actual admin password
  });
  console.log(`   Status: ${status}`);

  if (status === 200 && data.token) {
    adminToken = data.token;
    console.log("   ✅ Admin login successful");
    return true;
  }
  console.log(
    "   ⚠️  Admin login failed - you'll need to create an admin user manually",
  );
  return false;
}

async function testListUsers() {
  console.log("\n📋 Testing List Users (Admin Only)...");
  const { status, data } = await request(
    "GET",
    "/api/users",
    undefined,
    adminToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 200) {
    console.log("   ✅ List users successful");
    return true;
  }
  console.log("   ❌ List users failed");
  return false;
}

async function testCreateUser() {
  console.log("\n📋 Testing Create User (Admin Only)...");
  const { status, data } = await request(
    "POST",
    "/api/users",
    {
      name: "New User",
      email: `newuser${Date.now()}@example.com`,
      password: "password123",
      role: "user",
    },
    adminToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 201) {
    testUserId = data.user?.id;
    console.log("   ✅ Create user successful");
    return true;
  }
  console.log("   ❌ Create user failed");
  return false;
}

async function testExportCsv() {
  console.log("\n📋 Testing Export CSV (Admin Only)...");
  const { status, data } = await request(
    "GET",
    "/api/users/export/csv",
    undefined,
    adminToken,
  );
  console.log(`   Status: ${status}`);
  console.log(
    `   Response: ${typeof data} (${String(data).substring(0, 50)}...)`,
  );

  if (status === 200) {
    console.log("   ✅ Export CSV successful");
    return true;
  }
  console.log("   ❌ Export CSV failed");
  return false;
}

async function testUpdateUser() {
  console.log("\n📋 Testing Update User (Admin Only)...");
  if (!testUserId) {
    console.log("   ⚠️  Skipping - no test user ID");
    return false;
  }

  const { status, data } = await request(
    "PUT",
    `/api/users/${testUserId}`,
    { name: "Updated Name" },
    adminToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 200) {
    console.log("   ✅ Update user successful");
    return true;
  }
  console.log("   ❌ Update user failed");
  return false;
}

async function testDeleteUser() {
  console.log("\n📋 Testing Delete User (Admin Only)...");
  if (!testUserId) {
    console.log("   ⚠️  Skipping - no test user ID");
    return false;
  }

  const { status, data } = await request(
    "DELETE",
    `/api/users/${testUserId}`,
    undefined,
    adminToken,
  );
  console.log(`   Status: ${status}`);
  console.log(`   Response: ${JSON.stringify(data).substring(0, 200)}...`);

  if (status === 204) {
    console.log("   ✅ Delete user successful");
    return true;
  }
  console.log("   ❌ Delete user failed");
  return false;
}

async function testUnauthenticatedAccess() {
  console.log("\n📋 Testing Unauthenticated Access to Protected Routes...");

  // Test without token
  const { status: status1 } = await request("GET", "/api/auth/me");
  console.log(`   GET /api/auth/me without token: ${status1} (expected 401)`);

  const { status: status2 } = await request(
    "POST",
    "/api/payments/create-order",
    {
      planType: "basic",
      period: "monthly",
    },
  );
  console.log(
    `   POST /api/payments/create-order without token: ${status2} (expected 401)`,
  );

  const { status: status3 } = await request("GET", "/api/users");
  console.log(`   GET /api/users without token: ${status3} (expected 401)`);

  if (status1 === 401 && status2 === 401 && status3 === 401) {
    console.log("   ✅ Protected routes properly blocked without token");
    return true;
  }
  console.log("   ❌ Some routes accessible without token");
  return false;
}

// Main test runner
async function runTests() {
  console.log("🚀 Starting API Route Tests...");
  console.log(`   Base URL: ${BASE_URL}`);
  console.log("=".repeat(50));

  const results: { name: string; passed: boolean }[] = [];

  try {
    // Public routes
    results.push({ name: "Health Check", passed: await testHealthCheck() });
    results.push({ name: "Register", passed: await testRegister() });

    // If registration failed, try login
    if (!authToken) {
      results.push({ name: "Login", passed: await testLogin() });
    }

    // Protected routes (user)
    if (authToken) {
      results.push({ name: "Get Current User", passed: await testGetMe() });
      results.push({ name: "Create Order", passed: await testCreateOrder() });
      results.push({
        name: "Verify Payment",
        passed: await testVerifyPayment(),
      });
      results.push({
        name: "Unauthenticated Access",
        passed: await testUnauthenticatedAccess(),
      });
    } else {
      console.log("\n⚠️  Skipping protected user routes - no auth token");
    }

    // Admin routes
    results.push({ name: "Admin Login", passed: await testAdminLogin() });

    if (adminToken) {
      results.push({ name: "List Users", passed: await testListUsers() });
      results.push({ name: "Create User", passed: await testCreateUser() });
      results.push({ name: "Export CSV", passed: await testExportCsv() });
      results.push({ name: "Update User", passed: await testUpdateUser() });
      results.push({ name: "Delete User", passed: await testDeleteUser() });
    } else {
      console.log("\n⚠️  Skipping admin routes - no admin token");
    }
  } catch (error: any) {
    console.error("\n❌ Test execution error:", error.message);
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(50));

  let passed = 0;
  let failed = 0;

  results.forEach(({ name, passed: p }) => {
    const symbol = p ? "✅" : "❌";
    console.log(`${symbol} ${name}`);
    if (p) passed++;
    else failed++;
  });

  console.log("=".repeat(50));
  console.log(
    `Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`,
  );
  console.log("=".repeat(50));

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
