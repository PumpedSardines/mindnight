<div align="center">
    <h1>The Resistance</h1>
    <p>A website where you can play the game The Resistance against your friends online</p>
</div>

![A screenshot of the game](./assets/lobby-screenshot.png)

<div align="center">
    <p><i>A preview of how the game looks</i></p>
</div>

## Overview

This is an implementation of the board game The Resistance that you can spin up and play with your friends. The frontend uses React and the backend is written in nodejs. Routing is managed by [nginx](https://nginx.org/en/).

## How to play The Resistance

Midnight is a logic deduction game where players must use reasoning, deception, and cunning to win.

The game begins by assigning each player a role: hacker or agent. Roles are hidden from agents, but hackers know everyone's roles. The objective is to win missions, with the first team to win 3 out of 5 missions declared the winner.

The game is divided into three phases: proposal, voting, and mission.

In the proposal phase, the first player proposes a team for the mission. The number of players needed depends on the round. The proposer can include themselves in the team.

After a proposal is made, all players vote on it. They can either accept or reject the proposed team. If **at least** 50% of players accept the proposal, the chosen players move on to the mission phase. If the proposal is rejected, the next player in line proposes a team, and the game returns to the proposal phase.

In the mission phase, the chosen players decide the mission's outcome. They can either hack the mission or fulfill it. If **any** player hacks the mission, it fails; otherwise, it succeeds. The number of hackers is revealed to all players, but individual actions remain secret. After the mission concludes, the next player in line proposes a team, and the game returns to the proposal phase.

## Running locally

The entire project can be run with [docker compose](https://docs.docker.com/compose/). Just run `docker compose up` in the root of the project. You need to set the PORT env variable to the port you want the server to use.
