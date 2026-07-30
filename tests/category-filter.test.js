import { describe, expect, it, vi } from "vitest";
import {
  createCategoryFilterController,
  filterCategories,
  formatCategoryFilterStatus,
  initCategoryFilters,
  normalizeCategoryQuery,
} from "../static/js/category-filter.js";

describe("normalizeCategoryQuery", () => {
  it("trims and lowercases query text", () => {
    expect(normalizeCategoryQuery("  JavaScript  ")).toBe("javascript");
  });

  it("normalizes nullish values to an empty string", () => {
    expect(normalizeCategoryQuery(null)).toBe("");
    expect(normalizeCategoryQuery(undefined)).toBe("");
  });
});

describe("filterCategories", () => {
  const categories = [
    { name: "JavaScript" },
    { name: "Static Sites" },
    { name: "Micro.blog" },
  ];

  it("does not activate filtering before three characters", () => {
    const state = filterCategories(categories, "ja");

    expect(state.isActive).toBe(false);
    expect(state.visibleCount).toBe(3);
    expect(state.results.map((result) => result.visible)).toEqual([true, true, true]);
  });

  it("matches case-insensitive substrings at three characters", () => {
    const state = filterCategories(categories, "SCR");

    expect(state.isActive).toBe(true);
    expect(state.visibleCount).toBe(1);
    expect(state.results.map((result) => result.visible)).toEqual([true, false, false]);
  });

  it("resets to all items for blank queries", () => {
    const state = filterCategories(categories, "   ");

    expect(state.isActive).toBe(false);
    expect(state.visibleCount).toBe(3);
    expect(state.hasMatches).toBe(true);
  });

  it("tracks empty active results", () => {
    const state = filterCategories(categories, "zzz");

    expect(state.isActive).toBe(true);
    expect(state.visibleCount).toBe(0);
    expect(state.totalCount).toBe(3);
    expect(state.hasMatches).toBe(false);
  });

  it("formats status text for default and active states", () => {
    expect(formatCategoryFilterStatus(filterCategories(categories, ""))).toBe("3 categories");
    expect(formatCategoryFilterStatus(filterCategories(categories, "blog"))).toBe("1 category found");
  });
});

describe("createCategoryFilterController", () => {
  it("updates item visibility, status, empty state, and clear control", () => {
    const fixture = createFilterFixture(["JavaScript", "Static Sites", "Micro.blog"]);
    const controller = createCategoryFilterController(fixture.root);

    expect(controller).not.toBeNull();
    expect(fixture.form.hasAttribute("hidden")).toBe(false);
    expect(fixture.status.getAttribute("role")).toBe("status");
    expect(fixture.status.getAttribute("aria-live")).toBe("polite");
    expect(fixture.status.textContent).toBe("3 categories");
    expect(fixture.clear.hidden).toBe(true);

    const submitEvent = { preventDefault: vi.fn() };
    fixture.form.dispatch("submit", submitEvent);
    expect(submitEvent.preventDefault).toHaveBeenCalledTimes(1);

    fixture.input.value = "site";
    fixture.input.dispatch("input");

    expect(controller.getState().visibleCount).toBe(1);
    expect(fixture.items.map((item) => item.hidden)).toEqual([true, false, true]);
    expect(fixture.status.textContent).toBe("1 category found");
    expect(fixture.empty.hidden).toBe(true);
    expect(fixture.clear.hidden).toBe(false);
    expect(fixture.clear.disabled).toBe(false);

    fixture.input.value = "zzz";
    fixture.input.dispatch("input");

    expect(controller.getState().hasMatches).toBe(false);
    expect(fixture.items.map((item) => item.hidden)).toEqual([true, true, true]);
    expect(fixture.status.textContent).toBe("0 categories found");
    expect(fixture.empty.hidden).toBe(false);
  });

  it("clears the query and restores all categories", () => {
    const fixture = createFilterFixture(["JavaScript", "Static Sites"]);
    const controller = createCategoryFilterController(fixture.root);
    const event = { preventDefault: vi.fn() };

    fixture.input.value = "script";
    fixture.input.dispatch("input");
    fixture.clear.dispatch("click", event);

    expect(event.preventDefault).toHaveBeenCalledTimes(1);
    expect(fixture.input.value).toBe("");
    expect(fixture.input.focused).toBe(true);
    expect(controller.getState().isActive).toBe(false);
    expect(fixture.items.map((item) => item.hidden)).toEqual([false, false]);
    expect(fixture.clear.hidden).toBe(true);
    expect(fixture.clear.disabled).toBe(true);
  });

  it("is safe when required DOM is absent", () => {
    expect(createCategoryFilterController(new FakeElement({}))).toBeNull();
    expect(initCategoryFilters(new FakeElement({}))).toEqual([]);
  });

  it("initializes multiple wrappers", () => {
    const first = createFilterFixture(["JavaScript"]);
    const second = createFilterFixture(["Micro.blog"]);
    const doc = new FakeElement({}, "", [first.root, second.root]);

    expect(initCategoryFilters(doc)).toHaveLength(2);
    expect(first.form.hasAttribute("hidden")).toBe(false);
    expect(second.form.hasAttribute("hidden")).toBe(false);
  });
});

function createFilterFixture(names) {
  const input = new FakeElement({ "data-category-filter-input": "" });
  const form = new FakeElement({ "data-category-filter-form": "", hidden: "" }, "", [input]);
  const clear = new FakeElement({ "data-category-filter-clear": "" });
  const status = new FakeElement({ "data-category-filter-status": "" });
  const empty = new FakeElement({ "data-category-filter-empty": "", hidden: "" });
  const items = names.map(
    (name) => new FakeElement({ "data-category-filter-item": "", "data-category-name": name }, name),
  );
  const list = new FakeElement({ "data-category-filter-list": "" }, "", items);
  const root = new FakeElement(
    { "data-category-filter": "" },
    "",
    [form, clear, status, list, empty],
  );

  return { root, form, input, clear, status, empty, items };
}

class FakeElement {
  constructor(attributes = {}, textContent = "", children = []) {
    this.attributes = new Map(Object.entries(attributes));
    this.textContent = textContent;
    this.children = children;
    this.hidden = this.hasAttribute("hidden");
    this.disabled = false;
    this.value = "";
    this.focused = false;
    this.listeners = new Map();
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const results = [];
    const visit = (element) => {
      if (matchesSelector(element, selector)) {
        results.push(element);
      }

      for (const child of element.children) {
        visit(child);
      }
    };

    for (const child of this.children) {
      visit(child);
    }

    return results;
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  removeAttribute(name) {
    this.attributes.delete(name);

    if (name === "hidden") {
      this.hidden = false;
    }
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);

    if (name === "hidden") {
      this.hidden = true;
    }
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    listeners.push(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    const listeners = this.listeners.get(type) ?? [];
    this.listeners.set(
      type,
      listeners.filter((current) => current !== listener),
    );
  }

  dispatch(type, event = {}) {
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }

  focus() {
    this.focused = true;
  }
}

function matchesSelector(element, selector) {
  const match = selector.match(/^\[(?<attribute>[-\w]+)\]$/);

  if (!match?.groups) {
    throw new Error(`Unsupported selector in test fixture: ${selector}`);
  }

  return element.hasAttribute(match.groups.attribute);
}
