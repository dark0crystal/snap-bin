"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import Image from "next/image";

interface Reward {
  date: string;
  ip: string;
  items: string[];
}

export default function RewardsDashboard() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userIP, setUserIP] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  const t = useTranslations("rewards");
  const router = useRouter();

  useEffect(() => {
    // Fetch user IP
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setUserIP(data.ip);
        
        // Get rewards from localStorage
        const storedRewards = JSON.parse(localStorage.getItem('trashRewards') || '[]');
        setRewards(storedRewards);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching IP:', error);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getRewardPoints = (items: string[]) => {
    // Simple point system: 10 points per item
    return items.length * 10;
  };

  const getTotalPoints = () => {
    return rewards.reduce((total, reward) => total + getRewardPoints(reward.items), 0);
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🎉 {t("rewardsTitle")} 🎉</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {rewards.length > 0 ? (
            <div className="w-full">
              <div className="bg-green-100 p-6 rounded-lg mb-8 text-center">
                <h2 className="text-2xl font-bold text-green-800 mb-2">{t("totalPoints")}: {getTotalPoints()}</h2>
                <p className="text-green-700">{t("rewardsCount", { count: rewards.length })}</p>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {rewards.map((reward, index) => (
                  <div key={index} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold">{t("rewardEarned")}</h3>
                        <p className="text-sm text-gray-600">{formatDate(reward.date)}</p>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        +{getRewardPoints(reward.items)} {t("points")}
                      </span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <p className="text-sm font-medium">{t("itemsRecycled")}:</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {reward.items.map((item, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button 
                  onClick={() => router.push("/")}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition"
                >
                  {t("backToHome")}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <div className="mb-6">
                <Image 
                  src="/no-rewards.svg" 
                  alt="No rewards yet" 
                  width={200} 
                  height={200}
                  className="mx-auto"
                />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t("noRewardsYet")}</h2>
              <p className="text-gray-600 mb-6">{t("startRecycling")}</p>
              <button 
                onClick={() => router.push("/detect")}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
              >
                {t("startRecycling")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
} 