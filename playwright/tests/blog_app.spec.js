const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Testaaja",
        username: "TestiTestaaja",
        password: "sala",
      },
    });

    await page.goto("/");
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
      // Use a unique test id for the blog entry
      const blogDiv = page.getByTestId("blog-entry");
      await expect(blogDiv).toContainText("new blog by playwright");
    });

    describe("there is a blog", () => {
      beforeEach(async ({ page }) => {
        await createBlog(
          page,
          "new blog by playwright",
          "greenhorn",
          "newbie.com",
        );
      });

      test("a blog can be liked", async ({ page }) => {
        await page.getByRole("button", { name: "expand" }).click();
        await page.getByRole("button", { name: "like" }).click();

        await expect(page.getByTestId("likes")).toHaveText("1 like");
      });

      test("a blog can be deleted by the creator", async ({ page }) => {
        await page.getByRole("button", { name: "expand" }).click();
        page.on("dialog", async (dialog) => await dialog.accept());
        await page.getByRole("button", { name: "remove" }).click();

        const blogDiv = page.locator(".blog");
        await expect(blogDiv).not.toBeVisible();
      });
    });
  });
});
