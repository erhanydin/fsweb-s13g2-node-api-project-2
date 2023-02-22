// server için gerekli olanları burada ayarlayın

// posts router'ını buraya require edin ve bağlayın

const express = require("express");
const server = express();
server.use(express.json());

const router = require("./posts/posts-router");

server.use("/api/posts", router);


module.exports = server; 