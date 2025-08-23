import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import HelloWorld from "@/components/HelloWorld.vue";
import PrimeVue from "primevue/config";
import Button from "primevue/button";

describe("HelloWorld.vue", () => {
  it("incrémente le compteur au clic", async () => {
    const wrapper = mount(HelloWorld, {
      global: {
        plugins: [PrimeVue],
        components: { Button }
      }
    });

    // On attend que Vue ait fini de tout rendre
    await nextTick();

    const button = wrapper.get('[data-testid="increment-btn"]');
    const count = wrapper.get('[data-testid="count"]');

    expect(count.text()).toBe("0");

    await button.trigger("click");
    await nextTick(); // Attendre la mise à jour du DOM après clic

    expect(count.text()).toBe("1");
  });
});
