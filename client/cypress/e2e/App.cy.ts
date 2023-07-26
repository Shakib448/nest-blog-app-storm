// @ts-nocheck

describe("Testing application", () => {
  beforeEach(() => {
    cy.visit("/");
    // cy.login("shakib@gmail.com", "muktadir_shakib");
  });

  afterEach(() => {
    cy.request({
      method: "POST",
      url: "http://localhost:8000/api/seed",
    });
  });

  it("Home page Testing", () => {
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
    cy.get(".w-10 > img").click("center");
  });
});
