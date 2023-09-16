import { useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { inter, maven } from "@/fonts";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import ABI from "../crosschain-nft/ABI.json";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";

import { parseEther, parseGwei } from "viem";

const {
  AxelarAssetTransfer,
  AxelarQueryAPI,
  CHAINS,
  Environment,
} = require("@axelar-network/axelarjs-sdk");

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const contractAddress = "0x5dc9b53fc9d83fd233ae77591998b7db26cc9542";

export default function ReplicateFrontEnd() {
  const { address, isConnected } = useAccount();
  const [prediction, setPrediction] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>("Hello");
  const [desc, setDesc] = useState<string>("I am awesome");
  const [height, setHeight] = useState<string>("512");
  const [width, setWidth] = useState<string>("512");
  const [file, setFile] = useState<File>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { chain } = useNetwork();
  const [mintNetwork, setMintNetwork] = useState(chain?.name);
  const [metadata, setMetadata] = useState<string>("");
  const [fees, setFees] = useState<bigint>(0n);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setName((e.target as any).name.value);
    setDesc((e.target as any).prompt.value);
    console.log(mintNetwork);
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: (e.target as any).name.value,
        prompt: (e.target as any).prompt.value,
        negative_prompt: (e.target as any).negative_prompt.value,
        height: parseInt((e.target as any).height.value),
        width: parseInt((e.target as any).width.value),
      }),
    });
    let newPrediction = await response.json();
    if (response.status !== 201) {
      setError(newPrediction.detail);
      return;
    }
    setPrediction(newPrediction);

    while (
      newPrediction.status !== "succeeded" &&
      newPrediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + newPrediction.id);
      newPrediction = await response.json();
      if (response.status !== 200) {
        setError(newPrediction.detail);
        return;
      }
      console.log({ newPrediction });
      setPrediction(newPrediction);
    }
  };

  const handleMint = async () => {
    console.log(prediction.output[prediction.output.length - 1]);
    var data = JSON.stringify({
      name: name,
      description: desc,
      image: prediction.output[prediction.output.length - 1],
    });
    console.log(data);
    const metaData = await uploading(data);
    setMetadata(metaData);
    console.log(metaData);
    if (chain?.name === mintNetwork) {
      await writeAsync?.().then((res) => {
        if (chain?.name === "Polygon Mumbai") {
          console.log(
            "You can check the transaction here: https://mumbai.polygonscan.com/tx/" +
            res.hash
          );

          alert(
            "You can check the transaction here: https://mumbai.polygonscan.com/tx/" +
            res.hash
          );
        } else if (chain?.name === "Avalanche Fuji") {
          console.log(
            "You can check the transaction here: https://testnet.snowtrace.io/tx/" +
            res.hash
          );
          alert(
            "You can check the transaction here: https://testnet.snowtrace.io/tx/" +
            res.hash
          );
        } else if (chain?.name === "Fantom Testnet") {
          console.log(
            "You can check the transaction here: https://testnet.ftmscan.com/tx/" +
            res.hash
          );

          alert(
            "You can check the transaction here: https://testnet.ftmscan.com/tx/" +
            res.hash
          );
        }
      });
    } else handleCrossChainMint();
  };

  function calculateBridgeFee(
    source: string,
    destination: string,
    token: string
  ) {
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });

    return api.estimateGasFee(
      CHAINS.TESTNET[source.toUpperCase()],
      CHAINS.TESTNET[destination.toUpperCase()],
      token // MATIC // AVAX // FTM
    );
  }

  const handleCrossChainMint = async () => {
    // split the first word of the mintNetwork

    const currentChain = chain?.name?.split(" ")[0] as string;
    const destinationChain = mintNetwork?.split(" ")[0] as string;
    console.log(destinationChain);

    let token = "";

    if (currentChain === "Polygon") {
      token = "MATIC";
    } else if (currentChain === "Avalanche") {
      token = "AVAX";
    } else if (currentChain === "Fantom") {
      token = "FTM";
    }

    // calculate the bridge fee

    const bridgeFee = await calculateBridgeFee(
      currentChain,
      destinationChain,
      token
    );

    console.log(bridgeFee);

    // set the fees
    setFees(bridgeFee);

    await writeAsync2?.().then((res) => {
      console.log(res);

      console.log(
        "You can check the transaction here: https://testnet.axelarscan.io/gmp/" +
        res.hash
      );

      alert(
        "You can check the transaction here: https://testnet.axelarscan.io/gmp/" +
        res.hash
      );
    });
  };

  const uploading = async (e: any) => {
    console.log(e);
    // setLoading(2);
    const storage = new ThirdwebStorage({
      clientId: "bb55d02f9ac9150c4ddfdf1a927217ff",
    });
    const url = await storage.upload(e);
    console.log(url);
    // setLoading(0);
    return url;
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const prepareSafeMintContractWrite = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMint",
    args: [address, metadata],
  });

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(
    prepareSafeMintContractWrite.config
  );

  const preparesafeMintFromOtherChainContractWrite = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMintFromOtherChain",
    args: [
      "Polygon", // chain name  // Avalanche // Fantom
      "0x5dc9b53fc9d83fd233ae77591998b7db26cc9542",
      address,
      metadata,
    ],
    value: BigInt(fees),
  });

  const {
    data: data2,
    isLoading: isLoading2,
    isSuccess: isSuccess2,
    writeAsync: writeAsync2,
  } = useContractWrite(preparesafeMintFromOtherChainContractWrite.config);

  return (
    <>
      <Head>
        <title>CrossChain Canvas</title>
      </Head>
      <div className="w-11/12 h-11/12 p-10 flex bg-gradient-to-br from-blue-500/50 to-blue-500/5 backdrop-blur-[2.5px] shadow-blue-900 shadow-2xl text-black rounded-lg justify-between">
        <div className="w-2/5 h-full flex flex-col gap-8">
          <div
            className={`text-3xl font-semibold ${inter.className}`}
          >
            Dream something with OpenJourney:
          </div>

          <form className="w-full flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name of your awesome NFT"
              className="w-full p-3 rounded-md bg-white/30 text-black font-semibold placeholder-neutral-600 placeholder:font-medium"
            />
            <textarea
              name="prompt"
              placeholder="Enter a prompt to display an image"
              className="w-full p-3 rounded-md bg-white/30 text-black font-semibold placeholder-neutral-600 placeholder:font-medium"
              rows={3}
            />
            <input
              type="text"
              name="negative_prompt"
              placeholder="Specify things to not see in the output"
              className="w-full p-3 rounded-md bg-white/30 text-black font-semibold placeholder-neutral-600 placeholder:font-medium"
            />
            <label
              htmlFor="height"
              title="Select Image Height:"
              className="hidden"
            >
              Select Image Height:
            </label>
            <select
              id="height"
              name="height"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-3 rounded-md bg-white/30 text-black font-semibold placeholder-neutral-600 placeholder:font-medium"
            >
              <option value="128">128</option>
              <option value="256">256</option>
              <option value="512" selected>
                512
              </option>
            </select>
            <label
              htmlFor="width"
              title="Select Image width:"
              className="hidden"
            >
              Select Image Height:
            </label>
            <select
              id="width"
              name="width"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              className="w-full p-3 rounded-md bg-white/30 text-black font-semibold placeholder-neutral-600 placeholder:font-medium"
            >
              <option value="128">128</option>
              <option value="256">256</option>
              <option value="512" selected>
                512
              </option>
              <option value="1024">1024</option>
            </select>
            <div className="w-full h-full flex flex-row gap-1 justify-between">
              <button
                type="submit"
                className="w-1/2 bg-gradient-to-br from-glass-deep/80 to-glass-lite/40 hover:bg-glass-lite active:bg-glass-deep font-bold p-3 rounded-md"
              >
                GO
              </button>
              <button type='button' className="flex w-1/2 relative bg-gradient-to-br from-glass-deep/80 to-glass-lite/40 hover:bg-glass-lite active:bg-glass-deep  font-bold rounded-md items-center justify-evenly p-3 disabled:text-neutral-700 disabled:bg-glass-deep disabled:cursor-not-allowed" disabled={!prediction}>
                <div
                  onClick={handleMint}
                  className="w-full flex items-center justify-evenly"
                >
                  MINT NFT
                </div>
                <div className="absolute top-0 right-0 h-full flex justify-center items-center"
                  onClick={toggleDropdown}>
                  <div className="border-l border-brandGray-600 px-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <div
                    className={`${isDropdownOpen ? "block" : "hidden"
                      } absolute top-full right-0 w-32 shadow-lg rounded-md bg-white/30 text-black font-semibold placeholder-neutral-600 placeholder:font-medium`}
                  >
                    <ul className="w-full">
                      <li
                        className="w-full px-5 hover:bg-brandPurple-dark rounded-t-md py-0.5"
                        onClick={() => {
                          setMintNetwork("Polygon Mumbai");
                        }}
                      >
                        Polygon
                      </li>
                      <li
                        className="w-full border-y border-brandGray-200/40 px-5 hover:bg-brandPurple-dark py-0.5"
                        onClick={() => {
                          setMintNetwork("Avalanche Fuji");
                        }}
                      >
                        Avalanche
                      </li>
                      <li
                        className="w-full px-5 hover:bg-brandPurple-dark rounded-b-md py-0.5"
                        onClick={() => {
                          setMintNetwork("Fantom Testnet");
                        }}
                      >
                        Fantom
                      </li>
                    </ul>
                  </div>
                </div>
              </button>
            </div>
          </form>

          {error && <div>{error}</div>}
        </div>
        <div className="h-full w-1/2 flex flex-col justify-evenly items-center">
          {prediction && (
            <div className="relative w-full max-w-screen-xl aspect-auto h-[65vh] max-h-[70vh] flex flex-col gap-1 justify-evenly items-center">
              {prediction.output && (
                <div className="w-full h-full relative">
                  <Image
                    layout="fill"
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className="text-neutral-700 text-md font-mono font-bold">
                status: {prediction.status}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
