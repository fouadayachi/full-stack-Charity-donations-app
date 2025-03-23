import useShowCases from "@/store/useShowCaseStore";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { ImageIcon, PlusIcon, SearchIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { ShowcaseCard } from "./ShowcaseCard";
import { ShowcaseDeleteModal } from "./ShowcaseDeleteModal";
import { ShowcaseDetailsModal } from "./ShowcaseDetailsModal";
import { UpdateShowcaseModal } from "./UpdateShowcaseModal";

export interface Showcase {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  location: string;
  startDate: string;
  endDate: string;
  mainImage: string;
  images: string[];
  keyAchievements: string[];
}
export const ShowcasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedShowcase, setSelectedShowcase] = useState<Showcase | null>(
    null
  );
  const { showCases, getAllShowCases, deleteShowCase,updateShowCase,isUpdating } = useShowCases();

  const handleViewDetails = (showcase: Showcase) => {
    setSelectedShowcase(showcase);
    setIsDetailsModalOpen(true);
  };
  const handleDeleteClick = (showcase: Showcase) => {
    setSelectedShowcase(showcase);
    setIsDeleteModalOpen(true);
  };
  const handleDeleteConfirm = () => {
    deleteShowCase(selectedShowcase?._id as string);
    setIsDeleteModalOpen(false);
  };
  const handleUpdateShowcase = (data: Showcase) => {
    updateShowCase(data,data._id);
  };
  const handleEditShowcase = (showcase: Showcase) => {
    setSelectedShowcase(showcase);
    setIsUpdateModalOpen(true);
  };
  const filteredShowcases = useMemo(() => {
    return showCases.filter((showcase: any) => {
      return (
        searchQuery === "" ||
        showcase.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        showcase.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [showCases, searchQuery]);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    getAllShowCases();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A365D]">Showcases</h1>
            <p className="text-gray-600 mt-1">
              Share and celebrate our community&apos;s impact
            </p>
          </div>
          <Button as={Link} className="bg-[#3182CE] hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition-colors" href="/admin/showcases/addShowcase">
            <PlusIcon className="mr-2" size={16} />
            Add Showcase
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" size={16} />
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#3182CE] focus:border-[#3182CE] text-sm"
            placeholder="Search showcases by title or location..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      {filteredShowcases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShowcases.map((showcase: any) => (
            <ShowcaseCard
              key={showcase.id}
              formatDate={formatDate}
              showcase={showcase}
              onDelete={() => handleDeleteClick(showcase)}
              onEdit={() => handleEditShowcase(showcase)}
              onViewDetails={() => handleViewDetails(showcase)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[#3182CE] bg-opacity-10 flex items-center justify-center">
              <ImageIcon className="text-[#3182CE]" size={32} />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No showcases found
          </h3>
          <p className="text-gray-500 mb-4">
            Get started by creating your first showcase
          </p>
          <button className="bg-[#3182CE] hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center mx-auto transition-colors">
            <PlusIcon className="mr-2" size={16} />
            Add Showcase
          </button>
        </div>
      )}
      <ShowcaseDetailsModal
        formatDate={formatDate}
        isOpen={isDetailsModalOpen}
        showcase={selectedShowcase}
        onClose={() => setIsDetailsModalOpen(false)}
      />
      <ShowcaseDeleteModal
        isOpen={isDeleteModalOpen}
        showcaseTitle={selectedShowcase?.title || ""}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      <UpdateShowcaseModal
        isOpen={isUpdateModalOpen}
        isUpdating={isUpdating}
        showcase={selectedShowcase}
        onClose={() => {setIsUpdateModalOpen(false);setSelectedShowcase(null)}}
        onUpdate={handleUpdateShowcase}
      />
    </div>
  );
};
