"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useDisconnect, useWriteContract } from "wagmi";
import { toast } from "react-toastify";
import { OWSAbi } from "../address/ows";
import { fetchTokenList, OWS_SC_ADDRESS, explorer } from "../address/tokens.js";
import { useRouter } from "next/navigation";
import { erc20Abi } from "viem";
import Cookies from "js-cookie";
import { publicClient } from "./client";

const Home = () => {
  const { isConnected, address } = useAccount();
  const [loading, setLoading] = useState(false);
  const { disconnect } = useDisconnect();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [fwd, setfwd] = useState("");
  const [selectedToken, setSelectedToken] = useState("USDT");
  const [swapRatio, setSwapRatio] = useState(null);
  const [tokensList, setTokensList] = useState([]);
  const [formattedBalance, setFormattedBalance] = useState("0");
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [swapOutput, setSwapOutput] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const { writeContractAsync } = useWriteContract();

  const firstName = Cookies.get("first_name") || "";

  useEffect(() => {
    const loadTokens = async () => {
      const tokens = await fetchTokenList(); // Fetch the tokens from API
      setTokensList(tokens); // Set the fetched tokens in state
      console.log(tokens);
    };

    loadTokens(); // Call loadTokens on component mount
  }, []);

  // Fetch DID and authentication on page load
  useEffect(() => {
    const did = typeof window !== "undefined" ? Cookies.get("RNS") : null;
    if (!did) {
      setIsAuthenticated(false);
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const fetchBalances = async () => {
    if (isAuthenticated && isConnected && address && selectedToken) {
      console.log(selectedToken);

      const selectedTokenBalance = await fetchUserBalance(
        address,
        selectedToken
      );
      setFormattedBalance(selectedTokenBalance);

      const fwdBalance = await fetchUserBalance(address, "FWD");
      setfwd(fwdBalance);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, [isAuthenticated, selectedToken, isConnected, address]);

  useEffect(() => {
    // Fetch swap ratio from your API
    const fetchSwapRatio = async () => {
      try {
        const response = await fetch("/api/get-swap-ratio");
        const data = await response.json();

        const { ratio, status } = data;

        if (status && ratio) {
          setSwapRatio(ratio);
        } else {
          console.log("Invalid swap ratio received");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching the swap ratio:", err);
        setLoading(false);
      }
    };

    fetchSwapRatio();
  }, []);

  useEffect(() => {
    const checkWalletAddressAndRedirect = () => {
      if (!isConnected) {
        toast.error("No wallet connected. Please connect your wallet.");
        return;
      }

      try {
        const storedAddresses = JSON.parse(Cookies.get("addresses")) || [];
        if (storedAddresses.includes(address)) {
          toast.success("Wallet address verified!");
        } else {
          toast.error(
            "Connected wallet address is not linked with your DID, Disconnecting ....."
          );
          disconnect();
        }
      } catch (error) {
        toast.error("An error occurred while checking the wallet address.");
      }
    };

    if (isConnected) {
      checkWalletAddressAndRedirect();
    }
  }, [isAuthenticated, isConnected, address]);

  // Function to fetch user balance
  const fetchUserBalance = async (address, token) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/fetch-user-balance/${address}/${token}`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      const balance = !isNaN(parseFloat(data.balance))
        ? parseFloat(data.balance)
        : 0;

      return balance;
    } catch (error) {
      console.error("Error fetching balance:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate swap output
  const calculateSwapOutput = async (amount) => {
    if (!amount || parseFloat(amount) <= 0) {
      setSwapOutput("");
      return;
    }

    try {
      const response = await fetch("/api/calculate-swap-output-in-fwd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setSwapOutput(data.output.toFixed(4));
    } catch (error) {
      console.error("Error fetching swap output:", error);
      setSwapOutput("");
    }
  };

  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Handle input change
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    if (parseFloat(value) > parseFloat(formattedBalance)) {
      setInputError("Input exceeds balance");
      setSwapOutput("");
    } else {
      setInputError("");
      calculateSwapOutput(value);
    }
  };

  // Handle "Max" button click
  const handleMaxClick = () => {
    setInputValue(formattedBalance);
    calculateSwapOutput(formattedBalance);
  };

  // Handle token selection from the dropdown
  const selectToken = (tokenSymbol) => {
    setSelectedToken(tokenSymbol);
    setDropdownOpen(false);
  };

  const waitForTransactionReceipt = async (
    transactionHash,
    interval = 3000
  ) => {
    let receipt = null;

    while (!receipt) {
      try {
        receipt = await publicClient.getTransactionReceipt({
          hash: transactionHash,
        });
      } catch (error) {
        if (error?.message?.includes("Transaction receipt with hash")) {
          await new Promise((resolve) => setTimeout(resolve, interval)); // Wait for interval (3 seconds)
        } else {
          throw error;
        }
      }
    }
    return receipt;
  };

  // Confirm swap and write contract
  const handleConfirmClick = async () => {
    if (!inputValue || parseFloat(inputValue) < 100) {
      toast.error("Minimum swap amount is 100 USD equivalent");
      return;
    }

    try {
      const response = await fetch(
        `/api/fetch-token-approval/${address}/${selectedToken}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (data.status) {
        const token = tokensList.find(
          (token) => token.symbol === selectedToken
        );

        const swap_ratio_response = await fetch(`/api/get-swap-ratio`, {
          method: "GET",
        });
        const swap_ratio = await swap_ratio_response.json();

        if (parseFloat(data.allowance) >= parseFloat(inputValue)) {
          try {
            const swapTransactionHash = await writeContractAsync({
              address: OWS_SC_ADDRESS,
              abi: OWSAbi,
              functionName: "swap",
              args: [
                `${token.address}`,
                BigInt(inputValue * 10 ** token.decimals),
                0,
                30,
                BigInt(Math.round(parseFloat(swap_ratio.ratio) * 10 ** 6, 0)),
              ],
            });
            toast.info(`Swap Tx Hash:  ${swapTransactionHash}`);
            window.open(explorer + `/tx/${swapTransactionHash}`, "_blank");
            const receipt = await waitForTransactionReceipt(
              swapTransactionHash
            );
            console.log(receipt.status);

            if (receipt.status == "success") {
              toast.success("Swap Successful");
              const response = await fetch(
                "/api/increment-swap-amount-for-did",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    USD_amount: inputValue,
                    erc20_address: address,
                    tx_hash: swapTransactionHash,
                  }),
                }
              );
            } else {
              toast.error("Transaction reverted");
            }
          } catch (error) {
            toast.error(
              error?.message?.split("\n")[0] || "An unexpected error occurred."
            );
            console.log(error);
          }
        } else {
          try {
            const approvalTransactionHash = await writeContractAsync({
              address: token.address,
              abi: erc20Abi,
              functionName: "approve",
              args: [OWS_SC_ADDRESS, BigInt(inputValue * 10 ** token.decimals)],
            });

            toast.info(`Approval Tx Hash:  ${approvalTransactionHash}`);

            window.open(explorer + `/tx/${approvalTransactionHash}`, "_blank");

            const approvalReceipt = await waitForTransactionReceipt(
              approvalTransactionHash
            );

            if (approvalReceipt.status == "success") {
              toast.success("Approval successful, now swapping...");

              const swapTransactionHash = await writeContractAsync({
                addrers: OWS_SC_ADDRESS,
                abi: OWSAbi,
                functionName: "swap",
                args: [
                  token.address,
                  BigInt(inputValue * 10 ** token.decimals),
                  0,
                  30,
                  Math.round(parseFloat(swap_ratio.ratio) * 10 ** 6, 0),
                ],
              });

              toast.info(`Swap Tx Hash:  ${swapTransactionHash}`);

              window.open(explorer + `/tx/${swapTransactionHash}`, "_blank");

              const swapReceipt = await waitForTransactionReceipt(
                swapTransactionHash
              );

              if (swapReceipt.status == "success") {
                toast.success("Swap Successful");
                const response = await fetch(
                  "/api/increment-swap-amount-for-did",
                  {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      USD_amount: inputValue,
                      erc20_address: address,
                      tx_hash: swapTransactionHash,
                    }),
                  }
                );
              } else {
                toast.error("Transaction reverted");
              }
            } else {
              toast.error("transaction reverted ");
            }
          } catch (error) {
            toast.error("Approval or swap failed", error);
            console.error("Approval and swap error:", error);
          }
        }
      } else {
        toast.error("Failed to fetch allowance");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Transaction failed");
    }
    setInputValue("");
    setSwapOutput("");

    pause(2000);
    location.reload();
  };

  const handleGiftClick = async () => {
    if (!address) {
      toast.error("No address found. Please connect your wallet.");
      return;
    }

    try {
      const response = await fetch("/api/gas-faucet-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Gift request response:", data);

      if (data.status) {
        toast.success("Gift successfully requested!");
      } else {
        toast.error("Failed to request gift.");
      }
    } catch (error) {
      console.error("Error requesting gift:", error);
      toast.error("An error occurred while requesting the gift.");
    }
  };

  return (
    <>
      <div className="navbar p-4 flex flex-col md:flex-row justify-between items-center">
        <div className="ml-6">
          <div className="fade text-xl text-gray-100">Hello {firstName} 👋</div>
        </div>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            className="btn flex items-center p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            onClick={handleGiftClick}
          >
            <img src="/gift.svg" className="h-5 w-5 ml-5" alt="Gift Icon" />
            <span className="text-lg">Gas Faucet</span>
          </button>
          <w3m-button />
        </div>
      </div>

      <div className="main flex items-center justify-center min-h-screen">
        <main className="mt-10 overflow-auto h-screen text-gray-100 b">
          <div className="p-6 rounded-lg shadow-xl max-w-md mx-auto mt-6">
            {/* Sell Section */}
            <div className="p-4 c">
              <label className="block text-gray-300 text-xl text-left mb-2">
                Sell
              </label>
              <div className="flex items-center rounded-lg">
                <input
                  type="number"
                  placeholder="0"
                  value={inputValue}
                  onChange={handleInputChange}
                  className={`bg-transparent text-4xl text-gray-100 outline-none w-full ${
                    inputError ? "text-red-600" : ""
                  }`}
                />
                <div className="relative">
                  <div
                    className="bg-slate-950 text-gray-100 px-6 py-2 rounded-lg ml-2 flex items-center shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={
                        tokensList.find((token) => token.name === selectedToken)
                          ?.logo || ""
                      }
                      alt={selectedToken}
                      className="w-6 h-6 mr-2"
                    />
                    <span>
                      {
                        tokensList.find((token) => token.name === selectedToken)
                          ?.name
                      }
                    </span>
                    <svg
                      className="ml-2 w-4 h-4 text-gray-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  {dropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 b  border border-gray-300 rounded-lg shadow-lg">
                      <ul>
                        {tokensList.map((token) => (
                          <li
                            key={token.name}
                            className="p-3 hover:bg-gray-800 cursor-pointer rounded-lg flex items-center space-x-2"
                            onClick={() => selectToken(token.name)}
                          >
                            {token.logo && (
                              <img
                                src={token.logo}
                                alt={token.name}
                                className="w-6 h-6"
                              />
                            )}
                            <span>{token.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end items-center mt-2 ">
                <span className="text-[12px] whitespace-nowrap text-gray-400 font-semibold">{`Balance ${formattedBalance}`}</span>
                <button
                  onClick={handleMaxClick}
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Max
                </button>
              </div>
              {loading && <p className="text-gray-400 text-sm">Loading...</p>}
              {inputError && (
                <p className="text-red-500 text-sm">{inputError}</p>
              )}
            </div>

            {/* Arrow Section */}
            <div className="flex justify-center ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 19l-7-7h14l-7 7z"
                />
              </svg>
            </div>

            {/* <div className="bg-gray-900 p-4 rounded-lg">
              <label className="block text-gray-300 text-xl text-left mb-2">Receive</label>
              <div className="bg-transparent text-4xl text-gray-100 w-full">{swapOutput}</div>
            </div> */}

            <div className="mb-4 c mt-2 p-4">
              <label className="block text-gray-300 text-2xl text-left mb-2">
                Buy
              </label>
              <div className="flex items-center rounded-lg">
                <input
                  type="number"
                  placeholder="0"
                  value={swapOutput}
                  className="bg-transparent text-4xl text-gray-100 outline-none w-full"
                  readOnly
                />
                <button className="bg-slate-950 text-gray-100 px-3 py-1 rounded-lg ml-2 flex items-center shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src="/fwd.jpg"
                    alt="ETH"
                    className="h-6 w-6 mr-1 rounded-full"
                  />
                  <span>FWD</span>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-end items-center mt-2 mr-4">
                <span className="text-[12px] whitespace-nowrap text-gray-400 font-semibold">{`Balance ${fwd}`}</span>
              </div>
              <div></div>
            </div>
            <div className="text-gray-200 text-left my-4 text-sm font-semibold">
              {`1 FWD = ${swapRatio?.toFixed(6)} USD`}
            </div>
            {/* Swap Button */}
            <button
              className="btn tracking-widest h-10 w-full text-5xl font-bold"
              onClick={handleConfirmClick}
            >
              Swap
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
