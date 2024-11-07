"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.User = void 0;
var user_model_1 = require("@/models/user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_model_1).default; } });
var transaction_model_1 = require("@/models/transaction.model");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return __importDefault(transaction_model_1).default; } });
