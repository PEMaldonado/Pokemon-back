const app = require("../../src/app");
const request = require("supertest");

describe("Endpoint de pokemons", () => {
  it("Debería responder con un status 200 al pedir todos los pokemons", async () => {
    const res = await request(app).get("/pokemons");
    expect(res.statusCode).toBe(200);
  }, 10000);

  it("Debería responder con un status 400 al querer crear un pokemon sin enviar un body", async () => {
    const res = await request(app).post("/pokemons");
    expect(res.statusCode).toBe(400);
  });

  it("Debería responder con un status 201 al querer crear un pokemon enviando un body", async () => {
    const res = await request(app)
      .post("/pokemons")
      .send({
        name: "Chili",
        image:
          "https://w7.pngwing.com/pngs/601/175/png-transparent-dog-dog-png-pets-image-wild-life.png",
        life: "100",
        attack: "90",
        defense: "75",
        speed: "150",
        height: "1",
        weight: "50",
        types: ["shadow"],
      });
    expect(res.statusCode).toBe(201);
  });

  it("Debería responder con un status 200 al pedir un pokemon por id", async () => {
    const idPokemon = Math.floor(Math.random() * 300) + 1;
    const res = await request(app).get(`/pokemons/${idPokemon}`);
    expect(res.statusCode).toBe(200);
  });

  it("Debería responder con un status 200 al pedir un pokemon por nombre", async () => {
    const res = await request(app).get(`/pokemons/?name=bulbasaur`);
    expect(res.statusCode).toBe(200);
  });
});

describe("Endpoint de tipos", () => {
  it("Debería responder con un status 200 al pedir todos los tipos", async () => {
    const res = await request(app).get("/types");
    expect(res.statusCode).toBe(200);
  });
});
