// @ts-nocheck

describe("Testing application", () => {
  before(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/seed",
    });
  });

  it("Home page Testing", () => {
    cy.visit("/");

    cy.get(".bg-white").should("contain", "No post available");
    cy.get(".text-gray-600").should(
      "contain",
      "The page haven't any posts available"
    );
  });

  it("Signup page form should detect the error", () => {
    cy.visit("/sign-up");
    cy.get("#username").type("muktadir_shakib");
    cy.get("#email").type("shakib@gmail.com");
    cy.get("#password").type("t");
    cy.get("#confirmPassword").type("muktadir_shakib", { force: true });
    cy.get(".bg-blue-500").click("center");
    cy.get(".mt-2 > a").should("contain", "Already have an account?");
    cy.get(":nth-child(3) > .text-red-500").should("be.visible");
    cy.get(":nth-child(4) > .text-red-500").should("be.visible");
    cy.get('a[href="/sign-in"]')
      .invoke("attr", "href")
      .should("eq", "/sign-in");
  });

  it("Signup page form should create the user", () => {
    cy.visit("/sign-up");
    cy.get("#username").type("muktadir_shakib");
    cy.get("#email").type("shakib@gmail.com");
    cy.get("#password").type("muktadir_shakib");
    cy.get("#confirmPassword").type("muktadir_shakib", { force: true });
    cy.get(".bg-blue-500").click("center");
    cy.get(".mt-2 > a").should("contain", "Already have an account?");
    cy.get('a[href="/sign-in"]')
      .invoke("attr", "href")
      .should("eq", "/sign-in");
  });

  it("Should update the profile", () => {
    cy.login("shakib@gmail.com", "muktadir_shakib");

    cy.visit("/profile");

    cy.get('input[type="file"]').selectFile("assets/error.jpg", {
      force: true,
    });

    cy.get("#username").clear();
    cy.get("#username").type("new_muktadir_shakib");
    cy.get("#description").type("this is description");
    cy.get(".bg-blue-500").click("center");

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "contain",
      "File size must be less than 1.5MB"
    );

    cy.get('input[type="file"]').selectFile("assets/profile.jpg", {
      force: true,
    });
    cy.get(".bg-blue-500").click("center");

    cy.get(".Toastify__toast-body").should("be.visible");
  });

  it("Should create a new post", () => {
    cy.login("shakib@gmail.com", "muktadir_shakib");

    cy.visit("/create-post");

    cy.get('input[type="file"]').selectFile("assets/error.jpg", {
      force: true,
    });

    cy.get("#title").type("this is title");
    cy.get("#description").type("this is description");
    cy.get(".bg-blue-500").click("center");

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "contain",
      "File size must be less than 1.5MB"
    );

    cy.get('input[type="file"]').selectFile("assets/post.jpg", {
      force: true,
    });
    cy.get(".bg-blue-500").click("center");

    cy.get(".Toastify__toast-body").should("be.visible");
  });

  it("Should get the post", () => {
    cy.login("shakib@gmail.com", "muktadir_shakib");
    cy.visit("/");
    cy.get(".flex-grow").type("this is comment");
    cy.get(".bg-blue-500").click("center");
    cy.get(".flex-grow").type("this is comment2");
    cy.get(".bg-blue-500").click("center");
    cy.get(".text-blue-500").click("center");
    cy.get(".Toastify__toast-body > :nth-child(2)").should("be.visible");
    cy.get(':nth-child(1) > [style="margin-left: 20px;"] > .btn').click(
      "center"
    );
    cy.get(".Toastify__toast-body > :nth-child(2)").should("be.visible");
    cy.get(".bg-gray-200 > :nth-child(1) > a").click("center");

    cy.get('input[type="file"]').selectFile("assets/profile.jpg", {
      force: true,
    });

    cy.get("#title").clear();
    cy.get("#title").type("Update title");
    cy.get("#description").clear();
    cy.get("#description").type("Update Description");

    cy.get(".bg-blue-500").click("center");
    cy.get(".text-blue-500").click("center");
    cy.get(".bg-blue-500").click("center");
    cy.get(".h-64 > img").click("center");
    cy.visit("/");
    cy.get(".flex > p").click("center");
  });

  it("Should Update the password", () => {
    cy.login("shakib@gmail.com", "muktadir_shakib");
    cy.visit("/settings");
    cy.get("#currentPassword").type("shakib7023");
    cy.get("#newPassword").type("shakib7023");
    cy.get("#confirmPassword").type("shakib7023");

    cy.get(".bg-blue-500").click("center");
    cy.get(".Toastify__toast-body > :nth-child(2)").should("be.visible");
    cy.get("#currentPassword").clear();
    cy.get("#currentPassword").type("muktadir_shakib");
    cy.get(".bg-blue-500").click("center");
  });

  it("Should login with new password", () => {
    cy.visit("/sign-in");
    cy.get("#email").type("shakib@gmail.com");
    cy.get("#password").type("muktadir_shakib");
    cy.get(".bg-blue-500").click("center");

    cy.get(".Toastify__toast-body > :nth-child(2)").should(
      "contain",
      "Incorrect password written!"
    );
    cy.get("#password").clear();
    cy.get("#password").type("shakib7023");
    cy.get(".bg-blue-500").click("center");
    cy.visit("/");
  });
});
