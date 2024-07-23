"use client"
import React, { useEffect, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { getAllCategory } from '@/lib/mongodb/actions/category.action';
import { ICategory } from '@/lib/mongodb/database/models/category.model';
  

const CategoryFilter = () => {
    const [categories,setCategories]= useState<ICategory[]>([])
    const searchparams= useSearchParams();
    const router = useRouter();
    useEffect(()=>{
      const getCategories= async ()=>{
          const categoryList = await getAllCategory()
          categoryList && setCategories(categoryList as ICategory[])
      }
      getCategories()
  },[])
   

    const selectCategory=(category:string)=>{
      //console.log('inside select func--',category)
      let newUrl=''
          if(category && category !== 'All'){
             newUrl = formUrlQuery({
              params: searchparams.toString(),
              key:'category',
              value: category
            })
            //console.log(newUrl)
          }else{
             newUrl = removeKeysFromQuery({
              params: searchparams.toString(),
              keysToRemove:['category']
            })
          }
          router.push(newUrl, {scroll:false} );
    }
 

  return (
    
        <Select onValueChange={(value:string)=>selectCategory(value)}>
            <SelectTrigger className="select-field">
                <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem className='select-item p-regular-14' value="All">All</SelectItem>
                {
                  categories?.map((category)=>(
                    <SelectItem className='select-item p-regular-14' key={category._id} value={category.name}>{category.name}</SelectItem>
                  ))
                }
            </SelectContent>
        </Select>

    
  )
}

export default CategoryFilter