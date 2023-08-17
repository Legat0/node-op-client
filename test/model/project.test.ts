import em from "../em";
import { Project } from "../../src";

beforeAll(()=>{
  em
})

describe("project.test", () => {

  test.only("findOrFail", async () => {    
    const project = await Project.findOrFail(1);
    expect(project.id).toEqual(1);
  });

  test("getAll", async () => {    
    const result = await Project.getAll<Project>();
 
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(1);
  });


 
});
