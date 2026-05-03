"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children, onCreate }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "BANK",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
    setData, // 👈 add this
  } = useFetch(createAccount);


  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

useEffect(() => {
  if (newAccount?.success) {
    toast.success("Investment created successfully");
    reset();
    setOpen(false);

    // Optimistic update
    onCreate?.(newAccount.data);

    // 👇 Clear fetch state so next create works fine
    setData(null);
  }
}, [newAccount, reset, router, onCreate, setData]);


  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create investment account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Investment</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Investment Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="type" className="text-sm font-medium">
                Investment Type
              </label>
              <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")}>
                <SelectTrigger
                  id="type"
                  className="w-full border border-border bg-background text-foreground 
                            placeholder:text-muted-foreground rounded-md px-3 py-2 
                            focus:ring-2 focus:ring-ring"
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>

                <SelectContent className="bg-background text-foreground border border-border rounded-md shadow-md">
                  <SelectItem value="BANK" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Bank
                  </SelectItem>
                  <SelectItem value="STOCK" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Stocks
                  </SelectItem>
                  <SelectItem value="MUTUAL_FUND" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Mutual Funds
                  </SelectItem>
                  <SelectItem value="FD" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Fixed Deposit
                  </SelectItem>
                  <SelectItem value="CRYPTO" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Crypto Currency
                  </SelectItem>
                  <SelectItem value="GOLD" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Gold
                  </SelectItem>
                  <SelectItem value="REAL_ESTATE" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Real Estate
                  </SelectItem>
                  <SelectItem value="OTHER" className="hover:bg-accent hover:text-accent-foreground cursor-pointer">
                    Others
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium">
                Initial Amount
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-sm text-red-500">{errors.balance.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <label
                  htmlFor="isDefault"
                  className="text-base font-medium cursor-pointer"
                >
                  Set as Default
                </label>
                <p className="text-sm text-muted-foreground">
                  This account will be selected by default for transactions
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <DrawerClose asChild>
                <Button type="button" variant="outline" className="flex-1">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
