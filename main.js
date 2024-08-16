const apiKey = '2ecc6a18f1msh149a8c93469a116p1ff3e3jsn92ea038f0326'; 

$(document).ready(function () {
  const favoriteJobs = JSON.parse(localStorage.getItem('favoriteJobs')) || [];
  displayFavorites(favoriteJobs);

  $('#search-button').click(async function () {
    const query = $('#job-input').val().trim();
    if (query) {
      const jobs = await fetchJobs(query);
      displayJobs(jobs);
    }
  });

  async function fetchJobs(query) {
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: query,
        page: '1',
        num_pages: '1',
        date_posted: 'all'
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      return response.data.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  function displayJobs(jobs) {
    const jobList = $('#job-list');
    jobList.empty();

    jobs.forEach(job => {
      const jobCard = $(`
        <div class="job-card">
          <div>
            <h3>${job.job_title}</h3>
            <p>${job.employer_name}</p>
          </div>
          <button class="like-button">♡</button>
        </div>
      `);

      jobCard.find('.like-button').click(() => {
        addToFavorites(job);
      });

      jobList.append(jobCard);
    });
  }

  function addToFavorites(job) {
    const favoriteJobs = JSON.parse(localStorage.getItem('favoriteJobs')) || [];
    if (!favoriteJobs.some(fav => fav.job_id === job.job_id)) {
      favoriteJobs.push(job);
      localStorage.setItem('favoriteJobs', JSON.stringify(favoriteJobs));
      displayFavorites(favoriteJobs);
    }
  }

  function displayFavorites(jobs) {
    const favoriteList = $('#favorite-list');
    favoriteList.empty();

    jobs.forEach(job => {
      const jobCard = $(`
        <div class="job-card">
          <div>
            <h3>${job.job_title}</h3>
            <p>${job.employer_name}</p>
          </div>
          <button class="remove-button">Remove</button>
        </div>
      `);

      jobCard.find('.remove-button').click(() => {
        removeFromFavorites(job);
      });

      favoriteList.append(jobCard);
    });
  }

  function removeFromFavorites(job) {
    let favoriteJobs = JSON.parse(localStorage.getItem('favoriteJobs')) || [];
    favoriteJobs = favoriteJobs.filter(fav => fav.job_id !== job.job_id);
    localStorage.setItem('favoriteJobs', JSON.stringify(favoriteJobs));
    displayFavorites(favoriteJobs);
  }
});