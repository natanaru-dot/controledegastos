const storageKey = "nosso-caixa-state-v1";

const categories = {
  income: ["Salario", "Extra", "Presente", "Outro"],
  expense: ["Moradia", "Mercado", "Delivery", "Transporte", "Lazer", "Saude", "Assinaturas", "Outro"],
};

const defaultState = {
  couple: {
    personAName: "Natan",
    personAIncome: 2500,
    personBName: "Parceira",
    personBIncome: 2500,
  },
  entries: [
    {
      id: crypto.randomUUID(),
      description: "Mercado da semana",
      amount: 184.9,
      type: "expense",
      category: "Mercado",
      paidBy: "Natan",
      date: today(),
    },
    {
      id: crypto.randomUUID(),
      description: "Jantar",
      amount: 72,
      type: "expense",
      category: "Delivery",
      paidBy: "Parceira",
      date: today(),
    },
    {
      id: crypto.randomUUID(),
      description: "Salario",
      amount: 2500,
      type: "income",
      category: "Salario",
      paidBy: "Natan",
      date: today(),
    },
  ],
  goals: [
    { id: crypto.randomUUID(), name: "Reserva de emergencia", target: 5000, saved: 1200 },
    { id: crypto.randomUUID(), name: "Viagem", target: 3000, saved: 650 },
  ],
};

let state = loadState();
let activeFilter = "all";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const elements = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  pageTitle: document.querySelector("#pageTitle"),
  monthLabel: document.querySelector("#monthLabel"),
  incomeTotal: document.querySelector("#incomeTotal"),
  expenseTotal: document.querySelector("#expenseTotal"),
  balanceTotal: document.querySelector("#balanceTotal"),
  settlementText: document.querySelector("#settlementText"),
  categoryList: document.querySelector("#categoryList"),
  recentEntries: document.querySelector("#recentEntries"),
  allEntries: document.querySelector("#allEntries"),
  goalGrid: document.querySelector("#goalGrid"),
  entryModal: document.querySelector("#entryModal"),
  entryForm: document.querySelector("#entryForm"),
  goalModal: document.querySelector("#goalModal"),
  goalForm: document.querySelector("#goalForm"),
  entryType: document.querySelector("#entryType"),
  entryCategory: document.querySelector("#entryCategory"),
  entryPaidBy: document.querySelector("#entryPaidBy"),
  entryDate: document.querySelector("#entryDate"),
  coupleForm: document.querySelector("#coupleForm"),
  personAName: document.querySelector("#personAName"),
  personAIncome: document.querySelector("#personAIncome"),
  personBName: document.querySelector("#personBName"),
  personBIncome: document.querySelector("#personBIncome"),
  personAShareLabel: document.querySelector("#personAShareLabel"),
  personBShareLabel: document.querySelector("#personBShareLabel"),
  personAShare: document.querySelector("#personAShare"),
  personBShare: document.querySelector("#personBShare"),
  splitHint: document.querySelector("#splitHint"),
  exportBtn: document.querySelector("#exportBtn"),
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return structuredClone(defaultState);

  try {
    return { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function formatDate(dateValue) {
  return new Date(`${dateValue}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

function getMonthEntries() {
  const currentMonth = today().slice(0, 7);
  return state.entries.filter((entry) => entry.date.startsWith(currentMonth));
}

function getTotals(entries = getMonthEntries()) {
  return entries.reduce(
    (totals, entry) => {
      totals[entry.type] += Number(entry.amount);
      return totals;
    },
    { income: 0, expense: 0 }
  );
}

function getShares() {
  const a = Number(state.couple.personAIncome) || 0;
  const b = Number(state.couple.personBIncome) || 0;
  const total = a + b;

  if (!total) return { a: 0.5, b: 0.5 };
  return { a: a / total, b: b / total };
}

function getSettlement(entries = getMonthEntries()) {
  const expenses = entries.filter((entry) => entry.type === "expense");
  const total = expenses.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const paidA = expenses
    .filter((entry) => entry.paidBy === state.couple.personAName)
    .reduce((sum, entry) => sum + Number(entry.amount), 0);
  const shares = getShares();
  const expectedA = total * shares.a;
  const difference = paidA - expectedA;

  if (Math.abs(difference) < 1) return "Em dia";
  if (difference > 0) return `${state.couple.personBName} deve ${money.format(difference)}`;
  return `${state.couple.personAName} deve ${money.format(Math.abs(difference))}`;
}

function render() {
  renderMonth();
  renderDashboard();
  renderEntries();
  renderGoals();
  renderSettings();
  saveState();
}

function renderMonth() {
  elements.monthLabel.textContent = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });
}

function renderDashboard() {
  const entries = getMonthEntries();
  const totals = getTotals(entries);

  elements.incomeTotal.textContent = money.format(totals.income);
  elements.expenseTotal.textContent = money.format(totals.expense);
  elements.balanceTotal.textContent = money.format(totals.income - totals.expense);
  elements.settlementText.textContent = getSettlement(entries);

  const categoryTotals = entries
    .filter((entry) => entry.type === "expense")
    .reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + Number(entry.amount);
      return acc;
    }, {});

  const rows = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...rows.map(([, value]) => value), 1);

  elements.categoryList.innerHTML = rows.length
    ? rows
        .map(
          ([category, value]) => `
            <div class="category-row">
              <span>${category}</span>
              <div class="bar"><div class="bar-fill" style="width: ${(value / max) * 100}%"></div></div>
              <strong>${money.format(value)}</strong>
            </div>
          `
        )
        .join("")
    : `<div class="empty">Nenhum gasto neste mes.</div>`;

  elements.recentEntries.innerHTML = entries
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
    .map(entryTemplate)
    .join("") || `<div class="empty">Nenhum lancamento ainda.</div>`;
}

function renderEntries() {
  const entries = state.entries
    .filter((entry) => activeFilter === "all" || entry.type === activeFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  elements.allEntries.innerHTML = entries.map(entryTemplate).join("") || `<div class="empty">Nada para mostrar.</div>`;
}

function entryTemplate(entry) {
  const amountPrefix = entry.type === "income" ? "+" : "-";
  const amountClass = entry.type === "income" ? "income-text" : "expense-text";

  return `
    <article class="entry-item">
      <div class="entry-title">
        <strong>${escapeHtml(entry.description)}</strong>
        <span>${entry.category} · ${entry.paidBy}</span>
      </div>
      <span class="entry-amount ${amountClass}">${amountPrefix} ${money.format(entry.amount)}</span>
      <button class="delete-button" data-delete-entry="${entry.id}" type="button" title="Excluir" aria-label="Excluir">×</button>
      <span class="entry-meta">${formatDate(entry.date)}</span>
    </article>
  `;
}

function renderGoals() {
  elements.goalGrid.innerHTML = state.goals
    .map((goal) => {
      const progress = Math.min((Number(goal.saved) / Number(goal.target)) * 100, 100);
      return `
        <article class="goal-card">
          <h4>${escapeHtml(goal.name)}</h4>
          <div class="bar"><div class="bar-fill" style="width: ${progress}%"></div></div>
          <div class="goal-values">
            <span>${money.format(goal.saved)}</span>
            <strong>${Math.round(progress)}%</strong>
            <span>${money.format(goal.target)}</span>
          </div>
          <button class="delete-button" data-delete-goal="${goal.id}" type="button" title="Excluir" aria-label="Excluir">×</button>
        </article>
      `;
    })
    .join("") || `<div class="empty">Crie a primeira meta.</div>`;
}

function renderSettings() {
  const shares = getShares();

  elements.personAName.value = state.couple.personAName;
  elements.personAIncome.value = state.couple.personAIncome;
  elements.personBName.value = state.couple.personBName;
  elements.personBIncome.value = state.couple.personBIncome;
  elements.personAShareLabel.textContent = state.couple.personAName;
  elements.personBShareLabel.textContent = state.couple.personBName;
  elements.personAShare.textContent = `${Math.round(shares.a * 100)}%`;
  elements.personBShare.textContent = `${Math.round(shares.b * 100)}%`;
  elements.splitHint.textContent = `Gastos compartilhados podem ser divididos conforme a renda mensal cadastrada.`;

  elements.entryPaidBy.innerHTML = [state.couple.personAName, state.couple.personBName]
    .map((name) => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`)
    .join("");
}

function updateCategoryOptions() {
  elements.entryCategory.innerHTML = categories[elements.entryType.value]
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");
}

function switchTab(tabName) {
  elements.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  elements.views.forEach((view) => view.classList.toggle("active", view.id === `${tabName}View`));
  elements.pageTitle.textContent = document.querySelector(`[data-tab="${tabName}"]`).textContent;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };
    return map[char];
  });
}

document.addEventListener("click", (event) => {
  const tab = event.target.closest("[data-tab]");
  const shortcut = event.target.closest("[data-tab-shortcut]");
  const deleteEntry = event.target.closest("[data-delete-entry]");
  const deleteGoal = event.target.closest("[data-delete-goal]");

  if (tab) switchTab(tab.dataset.tab);
  if (shortcut) switchTab(shortcut.dataset.tabShortcut);
  if (event.target.closest("[data-open-entry]")) {
    elements.entryDate.value = today();
    updateCategoryOptions();
    elements.entryModal.showModal();
  }
  if (event.target.closest("[data-close-modal]")) event.target.closest("dialog").close();
  if (deleteEntry) {
    state.entries = state.entries.filter((entry) => entry.id !== deleteEntry.dataset.deleteEntry);
    render();
  }
  if (deleteGoal) {
    state.goals = state.goals.filter((goal) => goal.id !== deleteGoal.dataset.deleteGoal);
    render();
  }
});

document.querySelectorAll(".segment").forEach((segment) => {
  segment.addEventListener("click", () => {
    activeFilter = segment.dataset.filter;
    document.querySelectorAll(".segment").forEach((item) => item.classList.toggle("active", item === segment));
    renderEntries();
  });
});

elements.entryType.addEventListener("change", updateCategoryOptions);

elements.entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.entries.push({
    id: crypto.randomUUID(),
    description: document.querySelector("#entryDescription").value.trim(),
    amount: Number(document.querySelector("#entryAmount").value),
    type: elements.entryType.value,
    category: elements.entryCategory.value,
    paidBy: elements.entryPaidBy.value,
    date: elements.entryDate.value,
  });
  elements.entryForm.reset();
  elements.entryModal.close();
  render();
});

elements.goalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.goals.push({
    id: crypto.randomUUID(),
    name: document.querySelector("#goalName").value.trim(),
    target: Number(document.querySelector("#goalTarget").value),
    saved: Number(document.querySelector("#goalSaved").value),
  });
  elements.goalForm.reset();
  elements.goalModal.close();
  render();
});

document.querySelector("#addGoalBtn").addEventListener("click", () => elements.goalModal.showModal());

elements.coupleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.couple = {
    personAName: elements.personAName.value.trim() || "Pessoa 1",
    personAIncome: Number(elements.personAIncome.value) || 0,
    personBName: elements.personBName.value.trim() || "Pessoa 2",
    personBIncome: Number(elements.personBIncome.value) || 0,
  };
  render();
});

elements.exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nosso-caixa-dados.json";
  link.click();
  URL.revokeObjectURL(url);
});

updateCategoryOptions();
render();
