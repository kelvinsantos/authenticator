const { expect } = require("chai");
const request = require("supertest");
const sinon = require("sinon");
const config = require("config");

const app = require("../../app");

// Schemas
const Tenant = require("../../schemas/tenant");
const User = require("../../schemas/user");

// Utilities
const testUtil = require("../../tests/test-util");

let sandbox;
let CLEAR_PASSWORD = "Mouse123";

describe("authenticator-controller", () => {
  describe("POST /sign", () => {
    beforeEach((done) => {
      sandbox = sinon.createSandbox();

      testUtil.initDatabase(true).then(() => {
        testUtil.hashPassword(CLEAR_PASSWORD).then(hashedPassword => {
          Tenant.create({
            issuer: "Authenticator Test Customer App", 
            subject: "s.kelvinjohn@gmail.com", 
            audience: "https://kelvinsantos.github.io", 
            name: "Kelvin App",
            secret_key: "kelvinsecretkey"
          }).then(tenant => {
            User.create({ 
              email: "s.kelvinjohn@gmail.com", 
              password: hashedPassword, 
              first_name: "Kelvin", 
              last_name: "Santos",
              tenant: tenant._id
            }).then(user => {
              this.tenant = tenant;
              this.user = user;
              done();
            });
          });
        })
      });
    });

    afterEach((done) => {
      sandbox.restore();
      done();
    });

    it("sign will succeed if credentials are correct", (done) => {
      request(app).post(`/authenticator/sign`)
        .set("Accept", "application/json")
        .send({ email: "s.kelvinjohn@gmail.com", password: CLEAR_PASSWORD })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });

    it("sign will fail if credentials are incorrect", (done) => {
      request(app).post(`/authenticator/sign`)
        .set("Accept", "application/json")
        .send({ email: "no-user@gmail.com", password: CLEAR_PASSWORD })
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });
    
  });
});