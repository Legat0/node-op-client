import WP from "../../src/entity/WP/WP";
import Status from "../../src/entity/Status/Status";
import em from "../em";
import CustomOption from "../../src/entity/CustomOption/CustomOption";
import User from "../../src/entity/User/User";

// https://urz.open.ru:8091/projects/dash/work_packages/96
describe("em", () => {
  it("wp", async () => {
    const wp = await WP.findOrFail<WP>(1);
    // const wp = await em.get(WP, 1);
    expect(wp.body).toHaveProperty("createdAt");
  });

  it("not found wp", async () => {
    try {
      const wp = await WP.findOrFail<WP>(0); 
    } catch (error) {
      expect(error.message).toContain('Unauthenticated');
    }   
   
  });
  // it("status", async () => {
  //   const wp = await em.get(Status, 1);
  //   expect(wp.body).toHaveProperty("name");
  // });

  // it("custom object", async () => {
  //   let result: any[] = [];
  //   for (let x = 0; x < 10; x++) {
  //     try {
  //       const co = await em.get(CustomOption, x);
  //       result.push({ id: co.id, title: co.self.title });
  //     } catch (err) {}
  //   }
  //   console.table(result);
  // });
});
