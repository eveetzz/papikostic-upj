import { collection, doc, getDocs, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import {
  Users,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Edit,
  OctagonX,
  ClockFading,
  CircleCheck,
} from "lucide-react";

import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

import { LoadingSpinner } from "../../components/LoadingSpinner";
import { data, useNavigate } from "react-router-dom";
import { calculateTotalPersonalityScores } from "../../services/dataCharts";
import { getUserResults, getUsers } from "../../services/manageUser";

export const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    completedTest: 0,
    testThisMonth: 0,
    pendingReview: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [statusReview, setStatusReview] = useState([]);
  const [displayedUsers, setdisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    const getAllUsers = getUsers(setdisplayedUsers);

    return () => getAllUsers();
  }, []);

  useEffect(() => {
    const getAllUserResults = getUserResults(setRecentActivity);

    return () => getAllUserResults();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch koleksi users
        const userQuery = query(
          collection(db, "users"),
          orderBy("createdAt", "desc"),
        );
        const userSnaps = await getDocs(userQuery);

        const userList = userSnaps.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // fetch user_results

        // sort ambil yang terbaru
        const resultQuery = query(
          collection(db, "user_results"),
          orderBy("submittedAt", "desc"),
        );
        const resultSnaps = await getDocs(resultQuery);

        const resultsList = resultSnaps.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // hitung stats
        const totalUsers = userList.length;

        const completedTest = userList.filter(
          (u) => u.examStatus === "completed",
        ).length;

        const pendingReview = userList.filter(
          (u) => u.hasReviewed === false,
        ).length;

        // tes bulan ini
        const now = new Date();
        const currentMonth = now.getMonth();
        // const currentYear = now.getFullYear();

        const testThisMonth = resultsList.filter((res) => {
          const date = res.submittedAt?.toDate
            ? res.submittedAt.toDate()
            : new Date(res.submittedAt);
          return date.getMonth() === currentMonth;
        }).length;

        // meniapkan Data "Aktivitas Terbaru"
        // Ambil 5 data teratas dari resultsList (karena sudah disort desc tadi

        const recentActivities = resultsList.slice(0, 5).map((res) => {
          let actionLabel = "Menyelesaikan tes";

          if (res.examStatus === "in_progress") {
            actionLabel = "Memulai tes";
          }

          return {
            name: res.displayName || "unknown",
            action: actionLabel,
            time: res.duration,
          };
        });

        const statusReview = userList
          .filter((u) => u.hasReviewed === false)
          .slice(0, 5)
          .map((u) => {
            const date = u.examEndTime?.toDate
              ? u.examEndTime.toDate()
              : new Date();
            return {
              name: u.displayName,
              time: formatDistanceToNow(date, { addSuffix: true, locale: id }),
            };
          });

        // menyiapkan Data "Statistic Personality" (Grafik Bar)
        const chartFormatted = calculateTotalPersonalityScores(resultsList);

        setStats({
          totalUsers,
          completedTest,
          testThisMonth,
          pendingReview,
        });

        setRecentActivity(recentActivities);
        setStatusReview(statusReview);
        setdisplayedUsers(userList);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  // data untuk cards
  const statsData = [
    {
      label: "Total User",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Selesai Tes",
      value: stats.completedTest,
      icon: ClipboardCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Tes Bulan Ini",
      value: stats.testThisMonth,
      icon: ClipboardList,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Pending Review",
      value: stats.pendingReview,
      icon: Clock,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <>
      <div className="flex-1 bg-gray-50 p-6 overflow-auto">
        {/* HEADER */}
        <div className="mb-6 space-y-4">
          {/* BARIS JUDUL */}
          <div className="flex items-center gap-3">
            {/* Spacer untuk hamburger */}
            <div className="w-8 md:hidden" />

            <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <div className={`p-2 rounded ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aktivitas Terbaru */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-4">Aktivitas Terbaru</h2>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <div className="items-center justify-center flex flex-col gap-2 mt-15 ">
                  <OctagonX className="w-10 h-10 text-gray-300" />
                  <p className="text-gray-400 text-sm">Belum ada aktivitas</p>
                </div>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <CircleCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{activity.name}</p>
                      <p className="text-xs text-gray-600">{activity.action}</p>
                      {/* <p className="text-xs text-gray-600">{activity.time}</p> */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* status review */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="font-bold mb-4">Pending Review</h2>
            <div className="space-y-4">
              {statusReview.length === 0 ? (
                <div className="items-center justify-center flex flex-col gap-2 mt-15 ">
                  <OctagonX className="w-10 h-10 text-gray-300" />
                  <p className="text-gray-400 text-sm">Belum ada aktivitas</p>
                </div>
              ) : (
                statusReview.map((status, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                      <ClockFading className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{status.name}</p>
                      <p className="text-xs text-gray-600">{status.time}</p>
                      {/* <p className="text-xs text-gray-600">{activity.time}</p> */}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer> */}
          </div>
        </div>

        {/* Kelola Pengguna Table */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Daftar User</h2>
            <button
              className="text-blue-600 hover:text-blue-700"
              onClick={() => nav("/admin/manage-user")}
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className=" px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Role
                  </th>
                  <th className="w-[10vw] px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Exam Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.displayName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs `}>
                        {user.examStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
