import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import contractABI from "./ABI/contract_abi.json"; // adjust to your ABI JSON


// 👇 define the type for your contract (use ethers.Contract if you don’t have a generated type)
export type ContractType = ethers.Contract | null;

interface ContractContextProps {
  contract: ContractType;
}

const ContractContext = createContext<ContractContextProps | undefined>(
  undefined
);

export const ContractProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<ContractType>(null);

  useEffect(() => {
    const initContract = async () => {
      if ((window as any).ethereum) {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();

        const contractAddress = "0x0c8dbBCCE42b826d2Af884fFE869D5A30784170f"; // update with your deployed contract address
        const instance = new ethers.Contract(contractAddress, contractABI, signer);

        setContract(instance);

        // optional: debugging
        (window as any).contract = instance;
      }
    };

    initContract();
  }, []);

  return (
    <ContractContext.Provider value={{ contract }}>
      {children}
    </ContractContext.Provider>
  );
};

// custom hook to use contract in components
export const useContract = (): ContractType => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context.contract;
};
