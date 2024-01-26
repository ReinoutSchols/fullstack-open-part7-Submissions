describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);

    const user = {
      name: "reinout schols",
      username: "reinout",
      password: "password",
    };
    const user2 = {
      name: "mluukkai",
      username: "mluukkai",
      password: "password",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user2);
    cy.visit("");
  });

  it("Login form is shown", function () {
    cy.contains("Log in to application");
  });

  describe("Login", function () {
    it("user can login with correct credentials", function () {
      cy.get("input:first").type("reinout");
      cy.get("input:last").type("password");
      cy.contains("login").click();
      cy.contains("reinout logged in");
    });

    it("user login fails with wrong credentials", function () {
      cy.get("input:first").type("reinout");
      cy.get("input:last").type("password1");
      cy.contains("login").click();
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "reinout", password: "password" });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get("#title-id").type("amazing title");
      cy.get("#author-id").type("amazing author");
      cy.get("#url-id").type("url");
      cy.get("#create").click();
      cy.contains("amazing title amazing author");
    });

    it("Blog can be liked", function () {
      cy.contains("new blog").click();
      cy.get("#title-id").type("amazing title");
      cy.get("#author-id").type("amazing author");
      cy.get("#url-id").type("url");
      cy.get("#create").click();
      cy.get("#view").click();
      cy.get("#like").click();
      cy.contains("likes 1");
    });

    it("Blog can be deleted by creator", function () {
      cy.contains("new blog").click();
      cy.get("#title-id").type("amazing title");
      cy.get("#author-id").type("amazing author");
      cy.get("#url-id").type("url");
      cy.get("#create").click();
      cy.get("#view").click();
      cy.get("#delete").click();
      cy.contains("amazing title was deleted");
    });
  });

  describe("When logged in as different user", function () {
    it("Only the creator of the blog can see the delete button", function () {
      cy.login({ username: "reinout", password: "password" });

      cy.contains("new blog").click();
      cy.get("#title-id").type("amazing title");
      cy.get("#author-id").type("amazing author");
      cy.get("#url-id").type("url");
      cy.get("#create").click();

      cy.contains("logout").click();

      cy.login({ username: "mluukkai", password: "password" });
      cy.visit("");
      cy.get("#view").click();
      cy.get("#delete").should("not.exist");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "reinout", password: "password" });
    });

    it.only("the blog with most likes is at the top", function () {
      cy.contains("new blog").click();
      cy.get("#title-id").type("blog with 2 likes");
      cy.get("#author-id").type("amazing author");
      cy.get("#url-id").type("url");
      cy.get("#create").click();
      cy.get("#view").click();
      cy.get("#like").click();
      cy.get("#like").click();

      cy.get("#title-id").type("blog with zero likes");
      cy.get("#author-id").type("noob");
      cy.get("#url-id").type("nooburl");
      cy.get("#create").click();
      cy.get(".bloggos").eq(1).contains("View").click();

      cy.get(".bloggos").eq(0).should("contain", "blog with 2 likes");
    });
  });
});
