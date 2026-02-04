import Donation from "../models/donationModel.js";
import Events from "../models/eventsModel.js";
import ItemDonation from "../models/itemDonationModel.js";
import RequestHelp from "../models/requestsModel.js";
import User from "../models/userModel.js";
import Volunteer from "../models/volunteerModel.js";

export const getDashboardData = async (req, res) => {
  try {
    // Get the current date and the date one month ago
    const currentDate = new Date();
    const lastMonthDate = new Date();
    lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);

    // Total events and completed events
    const totalEvents = await Events.countDocuments();
    const completedEvents = await Events.countDocuments({
      status: "completed",
    });

    // Total users and increase from last month
    const totalUsers = await User.countDocuments();
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $lte: lastMonthDate },
    });
    let userIncreasePercentage;
    if (lastMonthUsers === 0) {
      userIncreasePercentage = totalUsers > 0 ? 100 : 0; // If last month had 0 users, and this month has users, it's a 100% increase
    } else {
      userIncreasePercentage =
        ((totalUsers - lastMonthUsers) / lastMonthUsers) * 100;
    }
    const totalMoneyRaisedResult = await Events.aggregate([
      { $match: { type: "donation" } },
      { $group: { _id: null, totalAmount: { $sum: "$currentAmount" } } },
    ]);
    const totalMoneyRaised =
      totalMoneyRaisedResult.length > 0
        ? totalMoneyRaisedResult[0].totalAmount
        : 0;

    const lastMonthMoneyRaisedResult = await Events.aggregate([
      {
        $match: {
          type: "donation",
          createdAt: { $lte: lastMonthDate },
        },
      },
      { $group: { _id: null, totalAmount: { $sum: "$currentAmount" } } },
    ]);
    const lastMonthMoneyRaised =
      lastMonthMoneyRaisedResult.length > 0
        ? lastMonthMoneyRaisedResult[0].totalAmount
        : 0;

    // Handle division by zero for money increase percentage
    let moneyIncreasePercentage;
    if (lastMonthMoneyRaised === 0) {
      moneyIncreasePercentage = totalMoneyRaised > 0 ? 100 : 0; // If last month had 0 donations, and this month has donations, it's a 100% increase
    } else {
      moneyIncreasePercentage =
        ((totalMoneyRaised - lastMonthMoneyRaised) / lastMonthMoneyRaised) *
        100;
    }

    // Total pending requests with high urgency
    const pendingRequests = await RequestHelp.countDocuments({
      status: "pending",
    });
    const highUrgencyRequests = await RequestHelp.countDocuments({
      status: "pending",
      urgency: "high",
    });

    // Prepare the response
    const dashboardData = {
      totalEvents,
      completedEvents,
      totalUsers: {
        count: totalUsers,
        increase: `${userIncreasePercentage.toFixed(
          2
        )}% increase from last month`,
      },
      totalMoneyRaised: {
        amount: totalMoneyRaised,
        increase: `${moneyIncreasePercentage.toFixed(2)}% increase from last month`,
      },
      pendingRequests: {
        count: pendingRequests,
        highUrgency: `${highUrgencyRequests} high urgency`,
      },
    };

    res
      .status(200)
      .json({
        message: "Dashboard data fetched successfully",
        data: dashboardData,
      });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPendingContributions = async (req, res) => {
  try {
    const pendingVolunteers = await Volunteer.countDocuments({ status: "pending" });
    const pendingItemDonations = await ItemDonation.countDocuments({ status: "pending" });
    const pendingMonetaryDonations = await Donation.countDocuments({ status: "pending" });

    const totalPendingContributions = pendingVolunteers + pendingItemDonations + pendingMonetaryDonations;

    res.status(200).json({
      message: "Pending contributions fetched successfully",
      data: totalPendingContributions,
    });
  } catch (error) {
    console.error("Error fetching pending contributions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
