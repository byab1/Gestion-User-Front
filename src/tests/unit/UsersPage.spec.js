import { mount } from "@vue/test-utils";
import UsersPage from "@/views/UsersPage.vue";

describe("UsersPage", () => {
  it("renders correctly", () => {
    const wrapper = mount(UsersPage, {
      global: {
        stubs: ["router-link", "router-view"]
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
