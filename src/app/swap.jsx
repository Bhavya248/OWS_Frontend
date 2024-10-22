import React, { useEffect, useState } from "react";

function SwapRatioComponent() {
  const [swapRatio, setSwapRatio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch swap ratio from your API
    const fetchSwapRatio = async () => {
      try {
        const response = await fetch("/api/get-swap-ratio");
        const data = await response.json();

        const { ratio, status } = data;

        if (status && ratio) {
          const calculatedRatio = 1 / ratio;
          setSwapRatio(calculatedRatio);
        } else {
          setError("Invalid swap ratio received");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch swap ratio");
        setLoading(false);
      }
    };

    fetchSwapRatio();
  }, []);

  if (loading) {
    return <p>Loading swap ratio...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="text-gray-400 font-semibold">
      {`1 USD = ${swapRatio ? swapRatio.toFixed(4) : "N/A"} FWD`}
    </div>
  );
}

export default SwapRatioComponent;
