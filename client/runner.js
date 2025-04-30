const idSendInput = document.querySelector("#idSend");

async function getSingleResult() {
    let idInput = document.querySelector("#idInput");
    let id = idInput.value.trim();
    const response = await fetch(`results/${id}`);
    if(response.ok){
      const result = await response.json();
      showResults([result]);
    }
    else{
      console.log("Race with that ID doesn not exist");
    }
}

function showResults(results) {
    const list = document.querySelector("#resultsList");
    list.innerHTML = "";
  
    for (const result of results) {
      const li = document.createElement("li");
      const header = document.createElement("div");
      header.textContent = `ID: ${result.id}`;
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
  

idSendInput.addEventListener("click", getSingleResult);