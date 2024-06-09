// Function to fetch data from API
async function fetchData() {
  try {
    const response = await fetch(
      "https://quran-api.santrikoding.com/api/surah"
    );
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const data = await response.json();
    const responseContainer = document.getElementById("api-response");

    // Display each item data in a card
    data.forEach((item) => {
      const card = document.createElement("div");
      card.className = "col-sm-2 col-md-3 col-lg-4 mb-3";
      card.innerHTML = `
        <div class="card mb-3 shadow p-3 rounded">
          <div class="card-header">
            <p class="nama-surah-latin d-inline-flex">${item.nomor}. Surah : ${item.nama_latin}</p>
            <p class="nama-surah-arab d-inline-flex float-right">${item.nama}</p>
          </div>
          <div class="card-body">
            <blockquote class="blockquote mb-0">
              <p class="arti">Arti : ${item.arti}</p>
              <footer class="blockquote-footer">Jumlah Ayat: ${item.jumlah_ayat}</footer>
            </blockquote>
            <!-- Button trigger modal -->
            <button class="mt-2 btn btn-sm btn-custom-readMore" data-toggle="modal" data-target="#exampleModal" data-id="${item.nomor}">Detail Surah</button>
          </div>
        </div>
      `;

      responseContainer.appendChild(card);
    });

    // Add event listeners for the detail buttons
    document.querySelectorAll(".btn-custom-readMore").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const dataID = event.target.getAttribute("data-id");
        const modalTitle = document.getElementById("judul-modal");
        const audioPlayer = document.getElementById("audio-player");
        const description = document.getElementById("deskripsi");
        const card = document.getElementById("card");

        try {
          const response = await fetch(
            `https://quran-api.santrikoding.com/api/surah/${dataID}`
          );
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          const data = await response.json();

          modalTitle.innerText = `${data.nomor}. ${data.nama_latin}`;
          audioPlayer.querySelector("source").src = data.audio;
          description.innerHTML = data.deskripsi;

          card.innerHTML = "";
          data.ayat.forEach((item) => {
            const ul = document.createElement("ul");
            ul.className = "list-group";
            ul.innerHTML = `
              <li class="list-group-item padding-5" style="font-family: 'Lateef'">
                <div class="d-flex w-100 justify-content-between">
                  <h5 class="text-muted">${item.nomor}.</h5>
                  <h2 class="mb-1 text-right">${item.ar}</h2>
                </div>
                <h5 class="mb-1 text-left">${item.idn}</h5>
              </li>
            `;
            card.appendChild(ul);
          });
          audioPlayer.load();
        } catch (error) {
          console.error(
            "There has been a problem with your fetch operation:",
            error
          );
          description.innerText = "Error: " + error.message;
        }
      });
    });

    // Add event listener for modal hidden event using plain JavaScript
    $(".btn-close").on("click", function () {
      $("#card").html(null);
      var audioPlayer = $("#audio-player")[0];
      audioPlayer.pause();
      audioPlayer.currentTime = 0; // Mengatur kembali ke awal
    });
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    document.getElementById("api-response").innerText =
      "Error: " + error.message;
  }
}

// Add event listener to call fetchData when the page loads
document.addEventListener("DOMContentLoaded", fetchData);
