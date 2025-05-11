const nameSendInput = document.querySelector("#nameSend");

async function getSingleResultByName() {
    let nameInput = document.querySelector("#nameInput");
    let name = nameInput.value.trim();
    const response = await fetch(`results/name/${name}`);
  
    const list = document.querySelector("#resultsList");
    list.innerHTML = "";
  
    if (response.ok) {
      const result = await response.json();
      showResults([result]);
    } else {
      const errorItem = document.createElement("li");
      errorItem.textContent = "Race with that name does not exist";
      errorItem.style.color = "red";
      list.appendChild(errorItem);
    }
}

async function getSingleResultdbByName() {
    let nameInput = document.querySelector("#nameInput");
    let name = nameInput.value.trim();
    const response = await fetch(`results/db/name/${name}`);
  
    const list = document.querySelector("#resultsList");
    list.innerHTML = "";
  
    if (response.ok) {
      const result = await response.json();
      showResults([result]);
    } else {
      const errorItem = document.createElement("li");
      errorItem.textContent = "Race with that name does not exist";
      errorItem.style.color = "red";
      list.appendChild(errorItem);
    }
}

function showResults(results) {
    const list = document.querySelector("#resultsList");
    list.innerHTML = "";
  
    for (const result of results) {
      const li = document.createElement("li");
      const header = document.createElement("div");
      header.textContent = `Race Name: ${result.name}`;
      li.appendChild(header);
  
      if (Array.isArray(result.participants) && result.participants.length > 0) {
        const sublist = document.createElement("ul");
        for (const p of result.participants) {
          const subitem = document.createElement("li");
          subitem.textContent = `${p.name} (${p.time})`;
          sublist.appendChild(subitem);
        }
        li.appendChild(sublist);
      } else {
        const noData = document.createElement("div");
        noData.textContent = "No participants data";
        li.appendChild(noData);
      }
  
      list.appendChild(li);
    }
  }

function checkOnlineStatusForGetSingleResult(){
  console.log("Online status:", navigator.onLine);

  if (navigator.onLine){
    getSingleResultdbByName();
  }
  else{
    getSingleResultByName();
  }
}

nameSendInput.addEventListener("click", checkOnlineStatusForGetSingleResult);

