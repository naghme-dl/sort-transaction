const showBtn = document.querySelector(".show-list");
const tableDOM = document.querySelector(".data-list_table");
// const trContent = document.querySelector(".transAction-container");
const content = document.querySelector(".content");
const search = document.querySelector(".search");

let allData = [];

const filter = { orderFilter: "", serachFilter: "" };

document.addEventListener("DOMContentLoaded", getAllData);

search.addEventListener("input", (e) => {
  findTransAction(e.target.value);
});

showBtn.addEventListener("click", () => {
  showAllData(allData);
});

async function getAllData() {
  allData = await axios
    .get(`http://localhost:3000/transactions`)
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

function showAllData(data) {
  showBtn.classList.add("unvisible");
  content.classList.remove("unvisible");
  search.classList.remove("unvisible");

  tableDOM.innerHTML = `  <tr id="stable">
              <th>ردیف</th>
              <th>نوع تراکنش</th>
              <th>
                <div> 
                  <span>مبلغ</span>
                  <span class="material-symbols-outlined expand-icon" id="1">
                    keyboard_arrow_down
                  </span>
                </div>
                <div class="sortby-btns unvisible" id="1">
                  <button data-id="desc" class="price">بیشترین</button>
                  <button data-id="asc" class="price">کمترین</button>
                </div> 
              </th>
              <th>شماره پیگیری</th>
              <th>
                <div> 
                  <span>تاریخ تراکنش</span>
                  <span class="material-symbols-outlined expand-icon" id="2">
                    keyboard_arrow_down
                  </span>
                </div>
                <div class="sortby-btns unvisible" id="2">
                  <button data-id="desc">جدیدترین</button>
                  <button data-id="asc">قدیمی ترین</button>
                </div>
              </th>
            </tr>`;

  const expandIcons = document.querySelectorAll(".expand-icon");
  const btns = document.querySelectorAll(".sortby-btns button");
  const AllSortByBtns = document.querySelectorAll(".sortby-btns");

  expandIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      showSortType(e.target, AllSortByBtns);
    });
  });

  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const dataId = e.target.dataset.id;
      filter.orderFilter = dataId;
      if (e.target.classList.contains("price")) {
        console.log(filter);
        sortByPrice(filter);
      } else {
        sortByDate(filter);
      }
    });
  });

  data.forEach((item) => showData(item));
}

function showData({ price, type, date, refId, id }) {
  const newTr = document.createElement("tr");
  const dateData = new Date(date).toLocaleString("fa-IR");
  newTr.innerHTML = `       
              <td>${id}</td>
              <td class= ${
                type === "برداشت از حساب" ? "red" : "green"
              }>${type}</td>
              <td>${price}</td>
              <td>${refId}</td>
              <td>${dateData}
               
            </td>
            `;
  tableDOM.appendChild(newTr);
}

function findTransAction(value) {
  filter.serachFilter = value;
  sortByPrice(filter);
  sortByDate(filter);
}

function showSortType(icon, AllSortByBtns) {
  icon.style.transform = " rotate(180deg)";
  icon.style.transition = " 0.7s ease";
  AllSortByBtns.forEach((sortBtns) => {
    if (sortBtns.id === icon.id) {
      sortBtns.classList.toggle("unvisible");
    }
  });
}

function sortByPrice({ orderFilter, serachFilter = "" }) {
  axios
    .get(
      `http://localhost:3000/transactions?refId_like=${serachFilter}&_sort=price&_order=${orderFilter}`
    )
    .then((res) => {
      console.log(res.data);
      showAllData(res.data);
    })
    .catch((err) => console.log(err));
}

function sortByDate({ orderFilter, serachFilter = "" }) {
  axios
    .get(
      `http://localhost:3000/transactions?refId_like=${serachFilter}&_sort=date&_order=${orderFilter}`
    )
    .then((res) => {
      console.log(res.data);
      showAllData(res.data);
    })
    .catch((err) => console.log(err));
}

// http://localhost:3000/transactions?refId_like=${serachFilter}&_sort=${priceFilter}&_order=esc
