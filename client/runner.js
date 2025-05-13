const nameSendInput = document.querySelector("#nameSend");

// gets a race based on the name the user input from local storage

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

// gets a race based on user input from the database

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

// displays the results of the race

function showResults(results) {
    const list = document.querySelector("#resultsList");
    list.innerHTML = "";

    for (const result of results) {
      const li = document.createElement("li");
      const header = document.createElement("div");
      header.textContent = `Race Name: ${result.name}`;
      li.appendChild(header);

      const exportButton = document.createElement("button");
      exportButton.textContent = "Export to CSV";
      exportButton.addEventListener("click", () => exportToCSV(result));
      li.appendChild(exportButton);

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

// exports the results of the selected race to a csv file

function exportToCSV(result) {
    const headers = ["Participant Name", "Time"];
    const rows = result.participants.map(p => [p.name, p.time]);

    rows.unshift(headers);

    const csvContent = rows.map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const link = document.createElement("a");
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, `${result.name}.csv`);
    } else {
        link.href = URL.createObjectURL(blob);
        link.download = `${result.name}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}


// checks the online status to determine whether to load the results from the database or local storage

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

