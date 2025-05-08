import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  User,
  CreditCard,
  Home,
  Package,
  PlusCircle,
  Trash2,
  Edit,
  Save,
} from "lucide-react";

// Mock user data - replace with actual API call
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://github.com/shadcn.png",
  paymentMethods: [
    {
      id: 1,
      cardNumber: "**** **** **** 4242",
      cardHolder: "John Doe",
      expiryDate: "12/25",
      isDefault: true,
    },
  ],
  addresses: [
    {
      id: 1,
      street: "123 Main St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      country: "USA",
      isDefault: true,
    },
  ],
};

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }),
});

const paymentFormSchema = z.object({
  cardNumber: z
    .string()
    .min(16, { message: "Please enter a valid card number." }),
  cardHolder: z.string().min(2, { message: "Please enter a valid name." }),
  expiryDate: z
    .string()
    .min(5, { message: "Please enter a valid expiry date." }),
  cvv: z.string().min(3, { message: "Please enter a valid CVV." }),
});

const addressFormSchema = z.object({
  street: z
    .string()
    .min(5, { message: "Please enter a valid street address." }),
  city: z.string().min(2, { message: "Please enter a valid city." }),
  state: z.string().min(2, { message: "Please enter a valid state." }),
  zipCode: z.string().min(5, { message: "Please enter a valid zip code." }),
  country: z.string().min(2, { message: "Please enter a valid country." }),
});

const OlfProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(mockUser);
  const [editingPayment, setEditingPayment] = useState<number | null>(null);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);
  const [addingPayment, setAddingPayment] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data - replace with actual API call
    // Example:
    // async function fetchUserData() {
    //   setIsLoading(true);
    //   try {
    //     const response = await fetch('/api/active_user');
    //     const data = await response.json();
    //     setUserData(data);
    //   } catch (error) {
    //     toast({
    //       title: "Error",
    //       description: "Failed to load user data. Please try again.",
    //       variant: "destructive",
    //     });
    //   } finally {
    //     setIsLoading(false);
    //   }
    // }
    // fetchUserData();
  }, []);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
    },
  });

  const paymentForm = useForm<z.infer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const addressForm = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const onProfileSubmit = async (data: z.infer<typeof profileFormSchema>) => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      // await fetch('/api/users', {
      //   method: 'PUT',
      //   body: JSON.stringify(data),
      // });

      // Simulate API call
      setTimeout(() => {
        setUserData({
          ...userData,
          name: data.name,
          email: data.email,
          phone: data.phone,
        });

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onPaymentSubmit = async (data: z.infer<typeof paymentFormSchema>) => {
    setIsLoading(true);
    try {
      // Replace with actual API call

      // Simulate API call
      setTimeout(() => {
        const newPayment = {
          id: Date.now(),
          cardNumber: `**** **** **** ${data.cardNumber.slice(-4)}`,
          cardHolder: data.cardHolder,
          expiryDate: data.expiryDate,
          isDefault: userData.paymentMethods.length === 0,
        };

        if (editingPayment !== null) {
          // Update existing payment
          const updatedPayments = userData.paymentMethods.map((payment) =>
            payment.id === editingPayment
              ? { ...payment, ...newPayment }
              : payment
          );
          setUserData({ ...userData, paymentMethods: updatedPayments });
        } else {
          // Add new payment
          setUserData({
            ...userData,
            paymentMethods: [...userData.paymentMethods, newPayment],
          });
        }

        toast({
          title: editingPayment !== null ? "Payment Updated" : "Payment Added",
          description:
            editingPayment !== null
              ? "Your payment method has been updated."
              : "Your payment method has been added.",
        });

        setAddingPayment(false);
        setEditingPayment(null);
        paymentForm.reset();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save payment method. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const onAddressSubmit = async (data: z.infer<typeof addressFormSchema>) => {
    setIsLoading(true);
    try {
      // Replace with actual API call

      // Simulate API call
      setTimeout(() => {
        const newAddress = {
          id: Date.now(),
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country,
          isDefault: userData.addresses.length === 0,
        };

        if (editingAddress !== null) {
          // Update existing address
          const updatedAddresses = userData.addresses.map((address) =>
            address.id === editingAddress
              ? { ...address, ...newAddress }
              : address
          );
          setUserData({ ...userData, addresses: updatedAddresses });
        } else {
          // Add new address
          setUserData({
            ...userData,
            addresses: [...userData.addresses, newAddress],
          });
        }

        toast({
          title: editingAddress !== null ? "Address Updated" : "Address Added",
          description:
            editingAddress !== null
              ? "Your address has been updated."
              : "Your address has been added.",
        });

        setAddingAddress(false);
        setEditingAddress(null);
        addressForm.reset();
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save address. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const deletePaymentMethod = (id: number) => {
    setUserData({
      ...userData,
      paymentMethods: userData.paymentMethods.filter(
        (payment) => payment.id !== id
      ),
    });

    toast({
      title: "Payment Method Removed",
      description: "Your payment method has been removed.",
    });
  };

  const deleteAddress = (id: number) => {
    setUserData({
      ...userData,
      addresses: userData.addresses.filter((address) => address.id !== id),
    });

    toast({
      title: "Address Removed",
      description: "Your address has been removed.",
    });
  };

  const setDefaultPayment = (id: number) => {
    setUserData({
      ...userData,
      paymentMethods: userData.paymentMethods.map((payment) => ({
        ...payment,
        isDefault: payment.id === id,
      })),
    });

    toast({
      title: "Default Payment Updated",
      description: "Your default payment method has been updated.",
    });
  };

  const setDefaultAddress = (id: number) => {
    setUserData({
      ...userData,
      addresses: userData.addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    });

    toast({
      title: "Default Address Updated",
      description: "Your default address has been updated.",
    });
  };

  const editPayment = (id: number) => {
    const payment = userData.paymentMethods.find((p) => p.id === id);
    if (payment) {
      // In a real app, you would populate this with actual data from the API
      paymentForm.reset({
        cardNumber: "4242424242424242", // This would be fetched securely
        cardHolder: payment.cardHolder,
        expiryDate: payment.expiryDate,
        cvv: "123", // This would be fetched securely
      });
      setEditingPayment(id);
      setAddingPayment(true);
    }
  };

  const editAddress = (id: number) => {
    const address = userData.addresses.find((a) => a.id === id);
    if (address) {
      addressForm.reset({
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      });
      setEditingAddress(id);
      setAddingAddress(true);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-10 px-4 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/")}>
              Home
            </Button>
            <Button variant="outline" onClick={() => navigate("/orders")}>
              My Orders
            </Button>
          </div>
        </div>

        <div className="grid gap-8">
          {/* User Profile */}
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription>{userData.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="example@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:w-auto"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Payment Methods and Addresses */}
          <Tabs defaultValue="payment-methods">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            {/* Payment Methods Tab */}
            <TabsContent value="payment-methods" className="space-y-4 mt-4">
              {!addingPayment ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">
                      Your Payment Methods
                    </h3>
                    <Button
                      onClick={() => {
                        paymentForm.reset({
                          cardNumber: "",
                          cardHolder: "",
                          expiryDate: "",
                          cvv: "",
                        });
                        setEditingPayment(null);
                        setAddingPayment(true);
                      }}
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Payment Method
                    </Button>
                  </div>

                  {userData.paymentMethods.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                          You haven't added any payment methods yet.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setAddingPayment(true)}
                        >
                          Add Your First Payment Method
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {userData.paymentMethods.map((payment) => (
                        <Card key={payment.id}>
                          <CardContent className="flex justify-between items-center p-6">
                            <div className="flex items-center gap-4">
                              <CreditCard className="h-8 w-8 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  {payment.cardNumber}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {payment.cardHolder} • Expires{" "}
                                  {payment.expiryDate}
                                </p>
                                {payment.isDefault && (
                                  <span className="inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!payment.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDefaultPayment(payment.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editPayment(payment.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deletePaymentMethod(payment.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingPayment !== null
                        ? "Edit Payment Method"
                        : "Add New Payment Method"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...paymentForm}>
                      <form
                        onSubmit={paymentForm.handleSubmit(onPaymentSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={paymentForm.control}
                            name="cardNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Card Number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="1234 5678 9012 3456"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={paymentForm.control}
                            name="cardHolder"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Cardholder Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={paymentForm.control}
                            name="expiryDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={paymentForm.control}
                            name="cvv"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="123"
                                    type="password"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setAddingPayment(false);
                              setEditingPayment(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Payment Method"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses" className="space-y-4 mt-4">
              {!addingAddress ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Your Addresses</h3>
                    <Button
                      onClick={() => {
                        addressForm.reset({
                          street: "",
                          city: "",
                          state: "",
                          zipCode: "",
                          country: "",
                        });
                        setEditingAddress(null);
                        setAddingAddress(true);
                      }}
                      size="sm"
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Address
                    </Button>
                  </div>

                  {userData.addresses.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-10">
                        <Home className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center">
                          You haven't added any addresses yet.
                        </p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setAddingAddress(true)}
                        >
                          Add Your First Address
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {userData.addresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="flex justify-between items-center p-6">
                            <div className="flex items-center gap-4">
                              <Home className="h-8 w-8 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{address.street}</p>
                                <p className="text-sm text-muted-foreground">
                                  {address.city}, {address.state}{" "}
                                  {address.zipCode}, {address.country}
                                </p>
                                {address.isDefault && (
                                  <span className="inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                    Default
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!address.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setDefaultAddress(address.id)}
                                >
                                  Set Default
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => editAddress(address.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteAddress(address.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {editingAddress !== null
                        ? "Edit Address"
                        : "Add New Address"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...addressForm}>
                      <form
                        onSubmit={addressForm.handleSubmit(onAddressSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={addressForm.control}
                            name="street"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel>Street Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="123 Main St" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="San Francisco"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="state"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>State</FormLabel>
                                <FormControl>
                                  <Input placeholder="CA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Zip Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="94103" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={addressForm.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input placeholder="USA" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setAddingAddress(false);
                              setEditingAddress(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Address"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default OlfProfile;
