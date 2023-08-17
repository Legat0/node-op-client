import WP from "../../src/entity/WP/WP";
import Status from "../../src/entity/Status/Status";
import em from "../em";
import CustomOption from "../../src/entity/CustomOption/CustomOption";
import User from "../../src/entity/User/User";
import {EntityFilterItem} from "../../src/contracts/EntityFilterItem";

beforeAll(()=>{
  em
})

// https://urz.open.ru:8091/projects/dash/work_packages/96
describe.skip("wp.test", () => {

  it("findOrFail", async () => {    
    const project = await WP.findOrFail(1);
    expect(project.id).toEqual(1);
  });

  it("getMany", async () => {    
    const pageSize = 10
    const result = await WP.getMany<WP>({pageSize});
 
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toBeGreaterThan(1);
    expect(result.length).toBeLessThanOrEqual(pageSize);
  });

  it("getAll+filter", async () => {    
   
    const filter: EntityFilterItem = { id: {operator: '=', values: [1] } }
    const result = await WP.getAll<WP>({ filters: [ filter]});
 
    expect(result).toBeInstanceOf(Array);
    expect(result.length).toEqual(1); 
  });

  it("findBy", async () => {       
    const result = await WP.findBy<WP>('id', 1)

    expect(result?.id).toEqual(1);
  });

  it("request+first", async () => {       
    const result = await WP.request<WP>().addFilter('id', '=', 1).first()
    
    expect(result?.id).toEqual(1);
  });

 
});
