export interface Contribution {
    date: string;
    type: string;
    event: string;
    amount: string;
    status: string;
    progress: string;
  }
  export const mockContributions: Contribution[] = [
    {
      date: "Oct 15, 2023",
      type: "Donation",
      event: "Disaster Relief Fund",
      amount: "$100",
      status: "Confirmed",
      progress: "50%"
    },
    {
      date: "Oct 10, 2023",
      type: "Volunteer",
      event: "Food Drive",
      amount: "5 Hours",
      status: "Confirmed",
      progress: "100%"
    },
    {
      date: "Oct 5, 2023",
      type: "Item Donation",
      event: "School Supplies",
      amount: "10 Items",
      status: "Pending",
      progress: "20%"
    },
    {
      date: "Sep 28, 2023",
      type: "Donation",
      event: "Animal Shelter",
      amount: "$250",
      status: "Confirmed",
      progress: "75%"
    },
    {
      date: "Sep 15, 2023",
      type: "Volunteer",
      event: "Beach Cleanup",
      amount: "3 Hours",
      status: "Confirmed",
      progress: "60%"
    },
    {
      date: "Sep 10, 2023",
      type: "Item Donation",
      event: "Clothing Drive",
      amount: "15 Items",
      status: "Confirmed",
      progress: "90%"
    },
    {
      date: "Aug 25, 2023",
      type: "Donation",
      event: "Children's Hospital",
      amount: "$500",
      status: "Confirmed",
      progress: "25%"
    },
    {
      date: "Aug 20, 2023",
      type: "Volunteer",
      event: "Elderly Care Center",
      amount: "8 Hours",
      status: "Confirmed",
      progress: "40%"
    },
    {
      date: "Aug 5, 2023",
      type: "Donation",
      event: "Education Fund",
      amount: "$150",
      status: "Pending",
      progress: "30%"
    },
    {
      date: "Jul 28, 2023",
      type: "Item Donation",
      event: "Food Bank",
      amount: "20 Items",
      status: "Confirmed",
      progress: "85%"
    }
  ];