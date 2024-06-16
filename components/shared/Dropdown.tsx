import React, { startTransition, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  
import { ICategory } from '@/lib/mongodb/database/models/category.model'
import { Input } from '../ui/input'

  

type DropdownProps={
    value?: string,         //Here ? means its optional...
    onChangeHandler: ()=> void      //a function which returns nothing
}
const Dropdown = ({value,onChangeHandler} : DropdownProps) => {
    const [categories,setCategories] =useState<ICategory[]>([]) //Array of type ICategory imported from category database model.
    const [newcategory,setNewCategory] = useState('')

    const handleAddCategory=()=>{
        
    }
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
        <SelectTrigger className="select-field">
            <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
            {
                categories.length >0 && categories.map((category)=>(
                    <SelectItem key={category._id} value={category._id} className='select-iem p-regular-14'>{category.name}</SelectItem>
                ))
            }
            <AlertDialog>
                <AlertDialogTrigger className='p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500'>Open</AlertDialogTrigger>
                <AlertDialogContent className="bg-white ">
                <AlertDialogHeader>
                    <AlertDialogTitle>New Category</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Input type='text' className='input-field mt-3' placeholder='Category name' onChange={(e)=>{setNewCategory(e.target.value)}}/>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=> startTransition(handleAddCategory)}>Add</AlertDialogAction>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </SelectContent>
    </Select>

  )
}

export default Dropdown