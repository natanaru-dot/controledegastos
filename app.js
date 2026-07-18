const storageKey = "nosso-caixa-state-v1";

const categories = {
  income: ["Salario", "Extra", "Presente", "Outro"],
  expense: ["Moradia", "Mercado", "Delivery", "Transporte", "Lazer", "Saude", "Assinaturas", "Outro"],
};

const defaultState = {
  couple: {
    fixedBills: [],
    personAName: "Natan",
    personAIncome: 2500,
    personBName: "Parceira",
    personBIncome: 2500, 
    hasSecondPerson: true,
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
let editingFixedBillId = null;
const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const elements = {
  customizationBtn:document.querySelector("#customizationBtn"),
  customizationModal:document.querySelector("#customizationModal"),
  customizationForm:document.querySelector("#customizationForm"),
  themeSelect:document.querySelector("#themeSelect"),
  removeAvatarBtn:document.querySelector("#removeAvatarBtn"),
  profileAvatar: document.querySelector("#profileAvatar"),
  avatarInput: document.querySelector("#avatarInput"),
  accountAvatar: document.querySelector("#accountAvatar"),
  myAccountBtn: document.querySelector("#myAccountBtn"),
  customizationBtn: document.querySelector("#customizationBtn"),
  securityBtn: document.querySelector("#securityBtn"),
  inviteBtn: document.querySelector("#inviteBtn"),
  accountModal: document.querySelector("#accountModal"),
  accountForm: document.querySelector("#accountForm"),
  accountName: document.querySelector("#accountName"),
  accountEmail: document.querySelector("#accountEmail"),
  profileButton: document.querySelector("#profileButton"),
  profileDropdown: document.querySelector("#profileDropdown"),
  profileDropdownName: document.querySelector("#profileDropdownName"),
  profileDropdownEmail: document.querySelector("#profileDropdownEmail"),
  loggedUserName: document.querySelector("#loggedUserName"),
  loginEmail: document.querySelector("#loginEmail"),
  loginPassword: document.querySelector("#loginPassword"),
  // Correção: o botão de sair no HTML tem id "logoutMenuBtn", não "logoutBtn".
  logoutBtn: document.querySelector("#logoutMenuBtn"),
  mainApp: document.querySelector("#mainApp"),
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  pageTitle: document.querySelector("#pageTitle"),
  monthLabel: document.querySelector("#monthLabel"),
  incomeTotal: document.querySelector("#incomeTotal"),
  expenseTotal: document.querySelector("#expenseTotal"),
  splitPanel: document.querySelector("#splitPanel"),
  balanceTotal: document.querySelector("#balanceTotal"),
  extraTotal: document.querySelector("#extraTotal"),
  availableAfterFixed: document.querySelector("#availableAfterFixed"),
  categoryList: document.querySelector("#categoryList"),
  fixedSummary: document.querySelector("#fixedSummary"),
  personSpendList: document.querySelector("#personSpendList"),
  recentEntries: document.querySelector("#recentEntries"),
  allEntries: document.querySelector("#allEntries"),
  goalGrid: document.querySelector("#goalGrid"),
  entryModal: document.querySelector("#entryModal"),
  entryForm: document.querySelector("#entryForm"),
  goalModal: document.querySelector("#goalModal"),
  goalForm: document.querySelector("#goalForm"),
  entryType: document.querySelector("#entryType"),
  authScreen: document.querySelector("#authScreen"),
  showLoginBtn: document.querySelector("#showLoginBtn"),
  showRegisterBtn: document.querySelector("#showRegisterBtn"),
  loginForm: document.querySelector("#loginForm"),
  registerForm: document.querySelector("#registerForm"),
  authMessage: document.querySelector("#authMessage"),
  registerName: document.querySelector("#registerName"),
  registerEmail: document.querySelector("#registerEmail"),
  registerPassword: document.querySelector("#registerPassword"),
  registerPasswordConfirm: document.querySelector("#registerPasswordConfirm"),
  entryCategory: document.querySelector("#entryCategory"),
  entryPaidBy: document.querySelector("#entryPaidBy"),
  entryPaidByLabel: document.querySelector("#entryPaidByLabel"),
  entryScopeField: document.querySelector("#entryScopeField"),
  fixedPaidBy: document.querySelector("#fixedPaidBy"),
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
  fixedList: document.querySelector("#fixedList"),
  fixedBillForm: document.querySelector("#fixedBillForm"),
  fixedName: document.querySelector("#fixedName"),
  fixedAmount: document.querySelector("#fixedAmount"),
  fixedDueDay: document.querySelector("#fixedDueDay"),
  fixedOrigin: document.querySelector("#fixedOrigin"),
  fixedEditModal: document.querySelector("#fixedEditModal"),
  fixedEditForm: document.querySelector("#fixedEditForm"),
  editFixedName: document.querySelector("#editFixedName"),
  editFixedAmount: document.querySelector("#editFixedAmount"),
  editFixedDueDay: document.querySelector("#editFixedDueDay"),
  editFixedPaidBy: document.querySelector("#editFixedPaidBy"),
  editFixedOrigin: document.querySelector("#editFixedOrigin"),
  secondPersonFields: document.querySelector("#secondPersonFields"),
  toggleSecondPersonBtn: document.querySelector("#toggleSecondPersonBtn"),
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
function getUserInitials(name) {

    if (!name) return "?";

    const parts = name
        .trim()
        .split(" ")
        .filter(Boolean);

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();

}

function getDisplayName(name) {

    if (!name) return "";

    const parts = name.trim().split(" ");

    if (parts.length === 1) {
        return parts[0];
    }

    return `${parts[0]} ${parts[parts.length - 1]}`;

}

function updateAccountAvatar(user) {

    if (!user) return;

    if (user.avatar) {

        const avatarHTML = `
            <img src="${user.avatar}" alt="Avatar">
        `;

        elements.accountAvatar.innerHTML = avatarHTML;
        elements.profileAvatar.innerHTML = avatarHTML;

        return;

    }

    const initials = getUserInitials(user.name);

    elements.accountAvatar.textContent = initials;
    elements.profileAvatar.textContent = initials;

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
  const totals = entries.reduce(
    (acc, entry) => {
      acc[entry.type] += Number(entry.amount);
      return acc;
    },
    { income: 0, expense: 0 }
  );

  totals.income +=
    Number(state.couple.personAIncome || 0) +
    Number(state.couple.personBIncome || 0);

  return totals;
}

function getShares() {
  const a = Number(state.couple.personAIncome) || 0;
  const hasSecondPerson = state.couple.hasSecondPerson !== false;

  if (!hasSecondPerson) {
    return { a: 1, b: 0 };
  }

  const b = Number(state.couple.personBIncome) || 0;
  const total = a + b;

  if (!total) {
    return { a: 0.5, b: 0.5 };
  }

  return {
    a: a / total,
    b: b / total
  };
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
  renderFixedBills();
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

  const extraTotal = entries
    .filter(
      (entry) =>
        entry.type === "income" &&
        entry.category === "Extra"
    )
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const totalFixed = (state.fixedBills || [])
    .reduce(
      (sum, bill) => sum + Number(bill.amount || 0),
      0
    );

  const balance = totals.income - totals.expense;
  const availableAfterFixed = balance - totalFixed;

  const personASpending = entries
    .filter(
      (entry) =>
        entry.type === "expense" &&
        entry.paidBy === state.couple.personAName
    )
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  const personBSpending = entries
    .filter(
      (entry) =>
        entry.type === "expense" &&
        entry.paidBy === state.couple.personBName
    )
    .reduce((sum, entry) => sum + Number(entry.amount), 0);

  elements.personSpendList.innerHTML = `
    <div class="person-spend-item">
      <span>${escapeHtml(state.couple.personAName)}</span>
      <strong>${money.format(personASpending)}</strong>
    </div>

    ${
      state.couple.hasSecondPerson !== false
        ? `
          <div class="person-spend-item">
            <span>${escapeHtml(state.couple.personBName)}</span>
            <strong>${money.format(personBSpending)}</strong>
          </div>
        `
        : ""
    }
  `;

  elements.incomeTotal.textContent = money.format(totals.income);
  elements.expenseTotal.textContent = money.format(totals.expense);
  elements.balanceTotal.textContent = money.format(balance);
  elements.extraTotal.textContent = money.format(extraTotal);
  elements.availableAfterFixed.textContent = money.format(availableAfterFixed);

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

  elements.fixedSummary.innerHTML = `
    <div class="fixed-total-card">
      <span>Total de contas fixas</span>
      <strong>${money.format(totalFixed)}</strong>
    </div>
  `;
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

function renderFixedBills() {
  if (!state.fixedBills || state.fixedBills.length === 0) {
    elements.fixedList.innerHTML =
      '<div class="empty">Nenhuma conta fixa cadastrada.</div>';
    return;
  }

  elements.fixedList.innerHTML = state.fixedBills
    .map(
      (bill) => `
        <article class="entry-item">
          <div class="entry-title">
            <strong>${escapeHtml(bill.name)}</strong>
            <span>
              Vence dia ${bill.dueDay}
              • ${escapeHtml(bill.paidBy)}
              • ${escapeHtml(bill.origin)}
            </span>
          </div>

          <span class="entry-amount expense-text">
            ${money.format(bill.amount)}
          </span>

          <button
            class="edit-button"
            data-edit-fixed="${bill.id}"
            type="button"
            >
            ✏️
            </button>

            <button

            class="delete-button"
            data-delete-fixed="${bill.id}"
            type="button"
          >
            ×
          </button>
        </article>
      `
    )
    .join("");
}
function entryTemplate(entry) {
  const amountPrefix = entry.type === "income" ? "+" : "-";
  const amountClass = entry.type === "income" ? "income-text" : "expense-text";

  return `
    <article class="entry-item">
      <div class="entry-title">
        <strong>${escapeHtml(entry.description)}</strong>
        <span>${escapeHtml(entry.category)} · ${escapeHtml(entry.paidBy)}</span>
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
  const hasSecondPerson = state.couple.hasSecondPerson !== false;

  elements.splitPanel.hidden = !hasSecondPerson;

  elements.secondPersonFields.style.display =
    hasSecondPerson ? "grid" : "none";

  elements.toggleSecondPersonBtn.textContent =
    hasSecondPerson
      ? "Remover segunda pessoa"
      : "+ Adicionar segunda pessoa";
  elements.personAName.value = state.couple.personAName;
  elements.personAIncome.value = state.couple.personAIncome;
  elements.personBName.value = state.couple.personBName;
  elements.personBIncome.value = state.couple.personBIncome;
  elements.personAShareLabel.textContent = state.couple.personAName;
  elements.personBShareLabel.textContent = state.couple.personBName;
  elements.personAShare.textContent = `${Math.round(shares.a * 100)}%`;
  elements.personBShare.textContent = `${Math.round(shares.b * 100)}%`;
  elements.splitHint.textContent = `Gastos compartilhados podem ser divididos conforme a renda mensal cadastrada.`;

  const activePeople = [state.couple.personAName];

  if (state.couple.hasSecondPerson !== false) {
    activePeople.push(state.couple.personBName);
  }

  elements.entryPaidBy.innerHTML = activePeople
    .map(
      (name) =>
        `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
    )
    .join("");

  elements.fixedPaidBy.innerHTML = activePeople
    .map(
      (name) =>
        `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
    )
    .join("");
}

function updateCategoryOptions() {
  const type = elements.entryType.value;

  elements.entryCategory.innerHTML = categories[type]
    .map((category) => `<option value="${category}">${category}</option>`)
    .join("");

  if (type === "income") {
    elements.entryPaidByLabel.textContent = "Quem recebeu";
    elements.entryScopeField.style.display = "none";
  } else {
    elements.entryPaidByLabel.textContent = "Quem pagou";
    elements.entryScopeField.style.display = "";
  }
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
  const deleteFixed = event.target.closest("[data-delete-fixed]");
  const editFixed = event.target.closest("[data-edit-fixed]");

  // Fecha o dropdown de perfil se o clique foi fora dele
  if (!event.target.closest(".profile-wrapper")) {
    elements.profileDropdown.classList.add("hidden");
  }

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

  if (deleteFixed) {
    state.fixedBills = state.fixedBills.filter(
      (bill) => bill.id !== deleteFixed.dataset.deleteFixed
    );
    render();
  }

  if (editFixed) {
    const bill = state.fixedBills.find(
      (item) => item.id === editFixed.dataset.editFixed
    );

    if (!bill) return;

    editingFixedBillId = bill.id;

    elements.editFixedName.value = bill.name;
    elements.editFixedAmount.value = bill.amount;
    elements.editFixedDueDay.value = bill.dueDay;

    const activePeopleForEdit = [state.couple.personAName];

    if (state.couple.hasSecondPerson !== false) {
      activePeopleForEdit.push(state.couple.personBName);
    }

    elements.editFixedPaidBy.innerHTML = activePeopleForEdit
      .map(
        (name) =>
          `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`
      )
      .join("");

    elements.editFixedPaidBy.value = bill.paidBy;
    elements.editFixedOrigin.value = bill.origin;

    elements.fixedEditModal.showModal();
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

  const hasSecondPerson = state.couple.hasSecondPerson !== false;

  state.couple = {
    ...state.couple,

    personAName:
      elements.personAName.value.trim() || "Pessoa 1",

    personAIncome:
      Number(elements.personAIncome.value) || 0,

    personBName: hasSecondPerson
      ? elements.personBName.value.trim() || "Pessoa 2"
      : "",

    personBIncome: hasSecondPerson
      ? Number(elements.personBIncome.value) || 0
      : 0,

    hasSecondPerson: hasSecondPerson
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

elements.myAccountBtn.addEventListener("click", () => {

    const user = JSON.parse(
        localStorage.getItem("nossoCaixaUser")
    );

    if (!user) return;

    elements.accountName.value = user.name;
    elements.accountEmail.value = user.email;

    updateAccountAvatar(user);

    elements.profileDropdown.classList.add("hidden");

    elements.accountModal.showModal();

});

elements.accountAvatar.addEventListener("click", () => {

    elements.avatarInput.click();

});

elements.removeAvatarBtn.addEventListener("click", () => {

    const user = JSON.parse(
        localStorage.getItem("nossoCaixaUser")
    );

    if (!user || !user.avatar) return;

    const confirmar = confirm(
        "Deseja realmente remover sua foto de perfil?"
    );

    if (!confirmar) return;

    delete user.avatar;

    localStorage.setItem(
        "nossoCaixaUser",
        JSON.stringify(user)
    );

    updateAccountAvatar(user);

});

elements.customizationBtn.addEventListener("click", () => {

    elements.profileDropdown.classList.add("hidden");

    const savedTheme =
        localStorage.getItem("nossoCaixaTheme") || "light";

    elements.themeSelect.value = savedTheme;

    elements.customizationModal.showModal();

});

elements.customizationForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const theme = elements.themeSelect.value;

    if (theme === "dark") {

        document.body.classList.add("dark");

    } else {

        document.body.classList.remove("dark");

    }

    localStorage.setItem(
        "nossoCaixaTheme",
        theme
    );

    elements.customizationModal.close();

});

elements.avatarInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

   reader.onload = () => {

    user.avatar = reader.result;

    updateAccountAvatar(user);

    const user = JSON.parse(
        localStorage.getItem("nossoCaixaUser")
    );

    if (!user) return;

    user.avatar = reader.result;

    localStorage.setItem(
        "nossoCaixaUser",
        JSON.stringify(user)
    );

};

    reader.readAsDataURL(file);

});


elements.accountName.addEventListener("input", () => {

    elements.accountAvatar.textContent =
        getUserInitials(elements.accountName.value);

});

elements.accountForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const user = JSON.parse(
        localStorage.getItem("nossoCaixaUser")
    );

    if (!user) return;

    user.name = elements.accountName.value.trim();
    user.email = elements.accountEmail.value.trim();

    localStorage.setItem(
        "nossoCaixaUser",
        JSON.stringify(user)
    );

    updateLoggedUser();

    elements.accountAvatar.textContent = getUserInitials(user.name);

    elements.accountModal.close();

});


elements.fixedBillForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!state.fixedBills) {
    state.fixedBills = [];
  }
  const billData = {
    name: elements.fixedName.value.trim(),
    amount: Number(elements.fixedAmount.value),
    dueDay: Number(elements.fixedDueDay.value),
    paidBy: elements.fixedPaidBy.value,
    origin: elements.fixedOrigin.value
  };

  if (editingFixedBillId) {
    const bill = state.fixedBills.find(
      (item) => item.id === editingFixedBillId
    );

    if (bill) {
      Object.assign(bill, billData);
    }

    editingFixedBillId = null;
  } else {
    state.fixedBills.push({
      id: crypto.randomUUID(),
      ...billData
    });
  }
  elements.fixedBillForm.reset();

  render();
});

elements.fixedEditForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const bill = state.fixedBills.find(
    (item) => item.id === editingFixedBillId
  );

  if (!bill) return;

  bill.name = elements.editFixedName.value.trim();
  bill.amount = Number(elements.editFixedAmount.value);
  bill.dueDay = Number(elements.editFixedDueDay.value);
  bill.paidBy = elements.editFixedPaidBy.value;
  bill.origin = elements.editFixedOrigin.value;

  editingFixedBillId = null;

  elements.fixedEditForm.reset();
  elements.fixedEditModal.close();

  render();
});

elements.toggleSecondPersonBtn.addEventListener("click", () => {
  const hasSecondPerson = state.couple.hasSecondPerson !== false;

  state.couple.hasSecondPerson = !hasSecondPerson;

  if (!state.couple.hasSecondPerson) {
    state.couple.personBName = "";
    state.couple.personBIncome = 0;
  }

  render();
});

function updateLoggedUser() {
  const savedUser = JSON.parse(
    localStorage.getItem("nossoCaixaUser")
  );

  if (savedUser) {
    elements.loggedUserName.textContent =
    `Olá, ${getDisplayName(savedUser.name)}`;
    elements.profileDropdownName.textContent = savedUser.name;
    elements.profileDropdownEmail.textContent = savedUser.email;
  } else {
    elements.loggedUserName.textContent = "";
    elements.profileDropdownName.textContent = "";
    elements.profileDropdownEmail.textContent = "";
  }
}

// Abre/fecha o menu do perfil
elements.profileButton.addEventListener("click", (event) => {
  event.stopPropagation();
  elements.profileDropdown.classList.toggle("hidden");
});

elements.showLoginBtn.addEventListener("click", () => {
  elements.loginForm.classList.remove("hidden");
  elements.registerForm.classList.add("hidden");

  elements.showLoginBtn.classList.add("active");
  elements.showRegisterBtn.classList.remove("active");

  elements.authMessage.textContent = "";
});

elements.registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = elements.registerName.value.trim();
  const email = elements.registerEmail.value.trim().toLowerCase();
  const password = elements.registerPassword.value;
  const passwordConfirm = elements.registerPasswordConfirm.value;

  if (password !== passwordConfirm) {
    elements.authMessage.textContent = "As senhas não são iguais.";
    return;
  }

  if (password.length < 6) {
    elements.authMessage.textContent =
      "A senha precisa ter pelo menos 6 caracteres.";
    return;
  }

  const user = {
    name: name,
    email: email
  };

  localStorage.setItem("nossoCaixaUser", JSON.stringify(user));
  localStorage.setItem("nossoCaixaSession", "true");

  elements.authScreen.style.display = "none";
  elements.mainApp.classList.remove("app-hidden");

  updateLoggedUser();
});

elements.showRegisterBtn.addEventListener("click", () => {
  elements.registerForm.classList.remove("hidden");
  elements.loginForm.classList.add("hidden");

  elements.showRegisterBtn.classList.add("active");
  elements.showLoginBtn.classList.remove("active");

  elements.authMessage.textContent = "";
});

elements.logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("nossoCaixaSession");

  elements.profileDropdown.classList.add("hidden");
  elements.mainApp.classList.add("app-hidden");
  elements.authScreen.style.display = "";

  elements.loginForm.reset();
  elements.registerForm.reset();

  elements.loginForm.classList.remove("hidden");
  elements.registerForm.classList.add("hidden");

  elements.showLoginBtn.classList.add("active");
  elements.showRegisterBtn.classList.remove("active");

  elements.authMessage.textContent = "";
});

elements.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = elements.loginEmail.value.trim().toLowerCase();

  const savedUser = JSON.parse(
    localStorage.getItem("nossoCaixaUser")
  );

  if (!savedUser) {
    elements.authMessage.textContent =
      "Nenhuma conta cadastrada. Crie uma conta primeiro.";
    return;
  }

  if (email !== savedUser.email) {
    elements.authMessage.textContent =
      "E-mail não encontrado.";
    return;
  }

  localStorage.setItem("nossoCaixaSession", "true");

  elements.authScreen.style.display = "none";
  elements.mainApp.classList.remove("app-hidden");

  elements.authMessage.textContent = "";

  updateLoggedUser();
});

const hasActiveSession =
  localStorage.getItem("nossoCaixaSession") === "true";

const savedUser =
  JSON.parse(localStorage.getItem("nossoCaixaUser"));

if (hasActiveSession && savedUser) {
  elements.authScreen.style.display = "none";
  elements.mainApp.classList.remove("app-hidden");
} else {
  elements.authScreen.style.display = "";
  elements.mainApp.classList.add("app-hidden");
}
const savedTheme =
    localStorage.getItem("nossoCaixaTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}

updateLoggedUser();
updateCategoryOptions();
render();