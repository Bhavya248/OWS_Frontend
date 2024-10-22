export const fetchTokenList = async () => {
  try {
    const response = await fetch("/api/get-token-list");
    const data = await response.json();

    const { status, token_list } = data;

    if (status && token_list) {
      console.log(token_list);

      return token_list;
    }
  } catch (err) {
    console.error("Error fetching the input tokens", err);
  }
};

export const OWS_SC_ADDRESS = "0xd980eF9B099cBF72507dd02ddbc6EDe0820360D4";

export const explorer = "https://arbiscan.io"
