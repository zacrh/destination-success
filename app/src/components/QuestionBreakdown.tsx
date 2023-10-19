import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import {useEffect, useState} from 'react';

  function capitalizeFirstLetter(string) {
    return string.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
}
  
  export const QuestionBreakdown = ({summary, questions}) => {
    console.log(summary, questions)


    // transfer summary to array of objects including field name and value under new fields 'name' and 'total'
    const summaryArray = Object.keys(summary).map(choice => ({
        name: choice,
        total: summary[choice]
    }))
    // if choices are yes and no, make sure yes comes first in array
    if (summaryArray.length === 2 && summaryArray[0].name === 'no') {
        summaryArray.reverse();
    }

    const totalVotes = summaryArray.reduce((a, b) => a + b.total, 0);

    return (
      <div className="space-y-8">
        {summary && questions && (
            
            
        Object.values(summaryArray).map((question, index) => (
          <div className="flex items-center">
          <Avatar className="h-9 w-9">
            {/* <AvatarImage src="/avatars/01.png" alt="Avatar" /> */}
            <AvatarFallback>{index + 1}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1 w-3/5">
            <p className="text-sm font-medium leading-none">{capitalizeFirstLetter(question.name)}</p>
            {/* <div className="text-sm text-muted-foreground flex justify-between">
                
            </div> */}
          </div>
          <div className="ml-auto font-medium">{question.total} ({Math.round((question.total / totalVotes) * 100)}%)</div>
        </div>
        ))
        
        // <div className="flex items-center">
        //   <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
        //     <AvatarFallback>2</AvatarFallback>
        //   </Avatar>
        //   <div className="ml-4 space-y-1">
        //     <p className="text-sm font-medium leading-none">Jackson Lee</p>
        //     <p className="text-sm text-muted-foreground">
        //       jackson.lee@email.com
        //     </p>
        //   </div>
        //   <div className="ml-auto font-medium">+$39.00</div>
        // </div>
        // <div className="flex items-center">
        //   <Avatar className="h-9 w-9">
        //     <AvatarImage src="/avatars/03.png" alt="Avatar" />
        //     <AvatarFallback>IN</AvatarFallback>
        //   </Avatar>
        //   <div className="ml-4 space-y-1">
        //     <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
        //     <p className="text-sm text-muted-foreground">
        //       isabella.nguyen@email.com
        //     </p>
        //   </div>
        //   <div className="ml-auto font-medium">+$299.00</div>
        // </div>
        // <div className="flex items-center">
        //   <Avatar className="h-9 w-9">
        //     <AvatarImage src="/avatars/04.png" alt="Avatar" />
        //     <AvatarFallback>WK</AvatarFallback>
        //   </Avatar>
        //   <div className="ml-4 space-y-1">
        //     <p className="text-sm font-medium leading-none">William Kim</p>
        //     <p className="text-sm text-muted-foreground">will@email.com</p>
        //   </div>
        //   <div className="ml-auto font-medium">+$99.00</div>
        // </div>
        // <div className="flex items-center">
        //   <Avatar className="h-9 w-9">
        //     <AvatarImage src="/avatars/05.png" alt="Avatar" />
        //     <AvatarFallback>SD</AvatarFallback>
        //   </Avatar>
        //   <div className="ml-4 space-y-1">
        //     <p className="text-sm font-medium leading-none">Sofia Davis</p>
        //     <p className="text-sm text-muted-foreground">
        //       sofia.davis@email.com
        //     </p>
        //   </div>
        //   <div className="ml-auto font-medium">+$39.00</div>
        // </div>
        )}
      </div>
    );
  }