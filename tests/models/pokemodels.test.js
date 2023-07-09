const { Pokemon, Type } = require("../../src/db");
const { conn } = require("../../src/db");

describe("Pokemon model", () => {
  beforeAll(async () => {
    await conn.sync({ force: true }); // Esto eliminará y creará de nuevo las tablas antes de correr las pruebas
  });

  it("Debería crear un pokemon correctamente", async () => {
    const pokemon = await Pokemon.create({
      name: "Pikachu",
      image: "https://ejemplo.com/pikachu.png",
      life: 50,
      attack: 50,
      defense: 40,
      speed: 90,
      height: 1,
      weight: 6,
    });
    expect(pokemon.id).toBeDefined();
    expect(pokemon.name).toBe("Pikachu");
    expect(pokemon.image).toBe("https://ejemplo.com/pikachu.png");
    expect(pokemon.life).toBe(50);
    expect(pokemon.attack).toBe(50);
    expect(pokemon.defense).toBe(40);
    expect(pokemon.speed).toBe(90);
    expect(pokemon.height).toBe(1);
    expect(pokemon.weight).toBe(6);
    expect(pokemon.created).toBe(true);
  });

  it("Debería requerir un nombre", async () => {
    await expect(
      Pokemon.create({
        image: "https://example.com/pikachu.png",
        life: 50,
        attack: 50,
        defense: 40,
        speed: 90,
        height: 1,
        weight: 6,
      })
    ).rejects.toThrow();
  });
});

describe("Modelo Type", () => {
  afterAll(async () => {
    await conn.close(); // Esto cerrará la conexión con la base de datos después de correr las pruebas
  });

  describe("Validaciones", () => {
    it("Debería lanzar un error si no se especifica el nombre", async () => {
      await expect(Type.create()).rejects.toThrow();
    });

    it("Debería crear un tipo si se especifica el nombre correctamente", async () => {
      const type = await Type.create({ name: "Normal" });
      expect(type.name).toBe("Normal");
    });
  });
});
