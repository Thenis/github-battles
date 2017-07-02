import axios from 'axios';

let id = 'YOUR_ID';
let sec = "YOUR_SECRET";
let params = `?client_id=${id}&client_secret${sec}`;

export function fetchPopularRepo(language) {
    let encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + language + '&sort=stars&order=desc&type=Repositories');

    return axios.get(encodedURI).then((res) => {
        return res.data.items;
    })
}

export function battle(players) {
    axios.all(players.map(getUserData))
    .then(sortPlayers)
    .catch(handleError);
}

function getProfile(username) {
    return axios.get(`https://api.github.com/users/${username}${params}`)
        .then((user) => {
            return user.data;
        });
}

function getRepos(username) {
    return axios.get(`https://api.github.com/users/${username}/repos${params}&per_page=100`);
}

function getStarCount(repos) {
    return repos.data.reduce((count, repo) => {
        return count + repo.stargazers_count;
    }, 0)
} 

function calcScore(profile, repos) {
    let followers = profile.followers;
    let totalStars = getStarCount(repos);

    return (followers * 3) + totalStars;
}

function handleError(err) {
    console.warn(err);

    return null;
}

function getUserData(player) {
    axios.all([
        getProfile(player),
        getRepos(player)
    ]).then((data) => {
        let [profile, repos] = data;

        return {
            profile: profile,
            score: calcScore(profile, repos)
        }
    });
}

function sortPlayers(players) {
    return players.sort((a, b) => b.score - a.score)
}