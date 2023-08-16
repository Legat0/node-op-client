import WP from "../../src/entity/WP/WP";
import Status from "../../src/entity/Status/Status";
import em from "../em";
import CustomOption from "../../src/entity/CustomOption/CustomOption";
import User from "../../src/entity/User/User";
import { Project } from "../../src";

// https://urz.open.ru:8091/projects/dash/work_packages/96
describe("project.test", () => {

  it("findOrFail", async () => {    
    const project = await Project.findOrFail(1);
    expect(project.id).toEqual(1);
  });

  it("getAll", async () => {    
    const result = await Project.getAll<Project>();
 
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(1);
  });


 
});
