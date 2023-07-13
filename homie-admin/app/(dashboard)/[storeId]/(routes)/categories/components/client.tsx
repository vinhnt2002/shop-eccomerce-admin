"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";

const CategoriesClient = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Categories"
          description="Manage category in your store"
        />
        <Button onClick={() =>{}}>  
            <Plus className="mr-2 h-4 w-4"/> Add New
        </Button>
      </div>
      <Separator/>
      <div>table</div>
      <Heading title="API" description="API Call for Categories"/>
      <Separator/>
      <div>list api here</div>
    </>
  );
};

export default CategoriesClient;
