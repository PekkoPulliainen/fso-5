const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("http://localhost:3001/api/testing/reset");
    await request.post("http://localhost:3001/api/users", {
      data: {
        name: "Testaaja",
        username: "TestiTestaaja",
        password: "sala",
      },
    });

    await page.goto("http://localhost:5173/");
  });

  test("Login form is shown", async ({ page }) => {
    const header = await page.getByTestId("login-header");
    await expect(header).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "TestiTestaaja", "sala");

      await expect(page.getByText("Testaaja logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "TestiTestaaja", "wrongest");

      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("Wrong credentials");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");

      await expect(page.getByText("Testaaja logged in")).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "TestiTestaaja", "sala");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(
        page,
        "new blog by playwright",
        "greenhorn",
        "newbie.com",
      );
      await expect(
        page.getByText("a new blog new blog by playwright by greenhorn added"),
      ).toBeVisible();
    });
  });
});
