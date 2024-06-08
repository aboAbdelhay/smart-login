let signupNameInput = document.querySelector("#signupName");
let signupEmailInput = document.querySelector("#signupEmail");
let signupPasswordInput = document.querySelector("#signupPassword");
let signInEmailInput = document.querySelector("#signInEmail");
let signInPasswordInput = document.querySelector("#signInPassword");
let signupBtn = document.querySelector("#signup");
let loginBtn = document.querySelector("#login");
let showUser = document.querySelector(".showUser");
let updateNameInput = document.querySelector("#updateName");
let updateEmailInput = document.querySelector("#updateEmail");
let updatePasswordInput = document.querySelector("#updatePassword");
let saveUpdateBtn = document.querySelector("#saveUpdateBtn");
// !for validation regex
let userNameValidation = /^[a-zA-Z0-9._-]{3,16}$/;
let emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
let passwordValidation =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
let users = [];
// !check localStorage is not empty
if (localStorage.getItem("usersDetails")) {
  users = JSON.parse(localStorage.getItem("usersDetails"));
}

function saveInformation() {
  if (validationInput()) {
    let user = {
      userName: signupNameInput.value,
      email: signupEmailInput.value,
      password: signupPasswordInput.value,
    };
    users.push(user);
    clearInput();
    localStorage.setItem("usersDetails", JSON.stringify(users));
  }
}

function clearInput() {
  signupNameInput.value = "";
  signupEmailInput.value = "";
  signupPasswordInput.value = "";
}

function validationInput() {
  for (let i = 0; i < users.length; i++) {
    if (signupEmailInput.value === users[i].email) {
      showUser.innerHTML = "Email already exists";
      showUser.classList.add("red");
      showUser.classList.remove("green");
      return false;
    }
  }
  if (
    userNameValidation.test(signupNameInput.value) &&
    emailValidation.test(signupEmailInput.value) &&
    passwordValidation.test(signupPasswordInput.value)
  ) {
    showUser.innerHTML = "Success";
    showUser.classList.add("green");
    showUser.classList.remove("red");
    setInterval(() => {
      showUser.innerHTML=''
    }, 4000);
    return true;
  } else {
    showUser.innerHTML = "Please confirm name, email, and password are valid";
    showUser.classList.add("red");
    showUser.classList.remove("green");
    return false;
  }
}

function checkData() {
  if (
    signInEmailInput.value === "admin" &&
    signInPasswordInput.value === "admin"
  ) {
    window.location.href = "admin.html";
  } else {
    for (let i = 0; i < users.length; i++) {
      if (
        signInEmailInput.value === users[i].email &&
        signInPasswordInput.value === users[i].password
      ) {
        let userName = `Welcome, ${users[i].userName}`;
        localStorage.setItem("nameForUser", userName);
        window.location.href = "home.html";
        return;
      }
    }
    showUser.innerHTML = "Incorrect email or password";
    showUser.classList.add("red");
    showUser.classList.remove("green");
  }
}
function display(arr) {
  let tr = "";
  for (let i = 0; i < arr.length; i++) {
    tr += `
      <tr>
        <th>${i + 1}</th>
        <td>${arr[i].userName}</td>
        <td>${arr[i].email}</td>
        <td>${arr[i].password}</td>
        <td class="actions-column">
          <button class="btn btn-danger btnDelete" data-index="${i}">
            <i class="fa-solid fa-trash-can pe-2"></i> Delete
          </button>
        </td>
        <td>
          <button class="btn btn-primary btnUpdate" data-index="${i}" data-bs-toggle="modal" data-bs-target="#updateModal">
            <i class="fa-solid fa-edit pe-2"></i> Update
          </button>
        </td>
      </tr>
    `;
  }
  $("#mainTable").DataTable().clear().destroy();
  document.querySelector("#tableBody").innerHTML = tr;
  $("#mainTable").DataTable({
    responsive: {
      details: {
        renderer: function (api, rowIdx, columns) {
          var data = $.map(columns, function (col, i) {
            return col.hidden
              ? '<tr data-dt-row="' +
                  col.rowIndex +
                  '" data-dt-column="' +
                  col.columnIndex +
                  '">' +
                  "<td>" +
                  col.title +
                  ":" +
                  "</td> " +
                  "<td>" +
                  col.data +
                  "</td>" +
                  "</tr>"
              : "";
          }).join("");
          return data ? $("<table/>").append(data) : false;
        },
      },
    },
    columnDefs: [
      { 
        targets: -1,
        orderable: false,
        className: "actions-column",
      },
    ],
  });
  // *when click btnDelete
  document.querySelectorAll(".btnDelete").forEach((btn) => {
    btn.addEventListener("click", function () {
      let index = this.getAttribute("data-index");
      users.splice(index, 1);
      localStorage.setItem("usersDetails", JSON.stringify(users));
      display(users);
    });
  });
  // *when click btnUpdate
  document.querySelectorAll(".btnUpdate").forEach((btn) => {
    btn.addEventListener("click", function () {
      let index = this.getAttribute("data-index");
      let user = users[index];
      updateNameInput.value = user.userName;
      updateEmailInput.value = user.email;
      updatePasswordInput.value = user.password;
      saveUpdateBtn.setAttribute("data-index", index);
    });
  });
}
if (document.querySelector(".btnAddUser")) {
  document.querySelector(".btnAddUser").addEventListener("click", function () {
    document.getElementById("addUserName").value = "";
    document.getElementById("addUserEmail").value = "";
    document.getElementById("addUserPassword").value = "";
  });
}
function saveNewUser() {
  let userName = document.getElementById("addUserName").value;
  let userEmail = document.getElementById("addUserEmail").value;
  let userPassword = document.getElementById("addUserPassword").value;
  let newUser = {
    userName: userName,
    email: userEmail,
    password: userPassword
  };
  users.push(newUser);
  localStorage.setItem("usersDetails", JSON.stringify(users));
  display(users);
  $("#addUserModal").modal("hide");
}

// !events click
if (document.querySelector(".welcome")) {
  document.querySelector(".welcome").innerHTML =
    localStorage.getItem("nameForUser");
}
if (signupBtn) signupBtn.addEventListener("click", saveInformation);
if (loginBtn) loginBtn.addEventListener("click", checkData);
if (document.querySelector("#mainTable")) {
  saveUpdateBtn.addEventListener("click", function () {
    let index = this.getAttribute("data-index");
    users[index].userName = updateNameInput.value;
    users[index].password = updatePasswordInput.value;
    localStorage.setItem("usersDetails", JSON.stringify(users));
    display(users);
    $("#updateModal").modal("hide");
  });
  display(users);
}
if (document.querySelector("#saveAddUserBtn")) {
  document.querySelector("#saveAddUserBtn").addEventListener("click", saveNewUser);
}
