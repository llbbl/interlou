const DEFAULT_MIN_QUERY_LENGTH = 3;

const selectors = {
  root: "[data-category-filter]",
  form: "[data-category-filter-form]",
  input: "[data-category-filter-input]",
  clear: "[data-category-filter-clear]",
  status: "[data-category-filter-status]",
  item: "[data-category-filter-item]",
  empty: "[data-category-filter-empty]",
};

export function normalizeCategoryQuery(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getCategoryName(item) {
  if (typeof item === "string") {
    return item;
  }

  if (item && typeof item === "object") {
    if ("name" in item) {
      return item.name;
    }

    if ("label" in item) {
      return item.label;
    }
  }

  return "";
}

export function filterCategories(items, query, options = {}) {
  const minQueryLength = options.minQueryLength ?? DEFAULT_MIN_QUERY_LENGTH;
  const normalizedQuery = normalizeCategoryQuery(query);
  const isActive = normalizedQuery.length >= minQueryLength;
  const sourceItems = Array.from(items ?? []);
  const results = sourceItems.map((item) => {
    const name = normalizeCategoryQuery(getCategoryName(item));
    const visible = !isActive || name.includes(normalizedQuery);

    return {
      item,
      visible,
    };
  });
  const visibleCount = results.filter((result) => result.visible).length;

  return {
    query: String(query ?? ""),
    normalizedQuery,
    isActive,
    results,
    totalCount: sourceItems.length,
    visibleCount,
    hasMatches: visibleCount > 0,
  };
}

export function formatCategoryFilterStatus(state) {
  if (!state.isActive) {
    return formatCategoryCount(state.totalCount, "category");
  }

  return `${formatCategoryCount(state.visibleCount, "category")} found`;
}

export function createCategoryFilterController(root, options = {}) {
  if (!root || typeof root.querySelector !== "function") {
    return null;
  }

  const input = root.querySelector(selectors.input);
  if (!input) {
    return null;
  }

  const form = root.querySelector(selectors.form);
  const clearControl = root.querySelector(selectors.clear);
  const status = root.querySelector(selectors.status);
  const empty = root.querySelector(selectors.empty);
  const itemElements = Array.from(root.querySelectorAll(selectors.item));
  const items = itemElements.map((element) => ({
    element,
    name: element.getAttribute("data-category-name") || element.textContent || "",
  }));
  let state = filterCategories(items, input.value, options);

  if (status) {
    setMissingAttribute(status, "role", "status");
    setMissingAttribute(status, "aria-live", "polite");
  }

  const apply = (query = input.value) => {
    state = filterCategories(items, query, options);

    for (const result of state.results) {
      result.item.element.hidden = !result.visible;
    }

    if (status) {
      status.textContent = formatCategoryFilterStatus(state);
    }

    if (empty) {
      empty.hidden = !state.isActive || state.hasMatches;
    }

    if (clearControl) {
      const hasQuery = state.normalizedQuery.length > 0;
      clearControl.hidden = !hasQuery;
      clearControl.disabled = !hasQuery;
    }

    return state;
  };

  const reset = () => {
    input.value = "";
    input.focus?.();
    return apply("");
  };

  const onInput = () => {
    apply(input.value);
  };

  const onClear = (event) => {
    event?.preventDefault?.();
    reset();
  };

  const onSubmit = (event) => {
    event?.preventDefault?.();
  };

  form?.removeAttribute?.("hidden");
  form?.addEventListener?.("submit", onSubmit);
  input.addEventListener?.("input", onInput);
  clearControl?.addEventListener?.("click", onClear);
  apply(input.value);

  return {
    apply,
    reset,
    destroy() {
      form?.removeEventListener?.("submit", onSubmit);
      input.removeEventListener?.("input", onInput);
      clearControl?.removeEventListener?.("click", onClear);
    },
    getState() {
      return state;
    },
  };
}

export function initCategoryFilters(doc = globalThis.document) {
  if (!doc || typeof doc.querySelectorAll !== "function") {
    return [];
  }

  return Array.from(doc.querySelectorAll(selectors.root))
    .map((root) => createCategoryFilterController(root))
    .filter(Boolean);
}

function formatCategoryCount(count, noun) {
  if (noun === "category") {
    return count === 1 ? "1 category" : `${count} categories`;
  }

  return count === 1 ? `1 ${noun}` : `${count} ${noun}s`;
}

function setMissingAttribute(element, name, value) {
  if (!element.hasAttribute?.(name)) {
    element.setAttribute?.(name, value);
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initCategoryFilters(document), {
      once: true,
    });
  } else {
    initCategoryFilters(document);
  }
}
