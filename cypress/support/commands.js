/// <reference types='cypress' />

Cypress.Commands.add("assertUserProperties", (user) => {
  expect(user).to.have.property("id").that.is.a("number");
  expect(user).to.have.property("name").that.is.a("string");
  expect(user).to.have.property("email").that.is.a("string");
  expect(user).to.have.property("gender").that.is.a("string");
  expect(user).to.have.property("status").that.is.a("string");
});

Cypress.Commands.add("assertValidationError", (error) => {
  expect(error).to.be.an("object");
  expect(error).to.have.property("field").that.is.a("string");
  expect(error).to.have.property("message").that.is.a("string");
});
