import { cn } from "@/lib/utils";
import { type LucideProps } from "lucide-react";

export const Icons = {
  logo: ({ className, ...props }: LucideProps) => (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 214 201"
      fill="#99C5FC"
      className={cn("h-10 w-10", className)}
      {...props}
    >
      <path d="M125.184563,115.276581 C123.472778,116.778679 122.017143,118.023277 120.561508,119.267876 C120.005486,119.138138 119.449463,119.008400 118.893440,118.878662 C118.893440,114.537926 118.670624,110.182175 118.961632,105.861031 C119.208984,102.188240 117.900154,100.256638 114.517555,98.619766 C99.251648,91.232452 90.993233,74.498123 94.572075,58.942101 C98.522682,41.770130 112.982391,30.100178 130.485397,30.026335 C141.315186,29.980644 152.145798,29.958441 162.975220,30.037069 C182.592133,30.179499 199.026627,46.774971 198.881210,66.204430 C198.736206,85.580040 182.587234,101.800880 163.224594,102.012939 C161.058823,102.036659 158.836807,102.343811 156.735748,101.976662 C143.487289,99.661522 133.117844,104.062248 125.184563,115.276581 M156.309082,60.797581 C161.605377,57.232872 164.919846,57.173904 168.286179,60.753284 C171.331406,63.991241 171.498962,67.510368 168.914352,71.129303 C165.977036,75.242119 160.148636,75.209320 155.440399,70.752502 C150.123840,65.719864 145.123810,60.353676 139.830429,55.295483 C134.508865,50.210354 125.985893,50.264732 120.351440,55.193436 C114.956024,59.913063 113.836121,68.066940 117.742691,74.187363 C121.823822,80.581261 129.916550,83.044861 136.462341,79.657158 C138.133423,78.792305 140.479813,77.239517 140.580734,75.861107 C140.695068,74.299446 138.633270,72.578461 137.401627,70.754974 C135.952393,71.873093 135.229309,72.562225 134.390808,73.054985 C130.918655,75.095482 125.991516,74.131630 123.600578,71.000557 C121.158234,67.802162 121.590424,63.720551 124.698952,60.627384 C128.310501,57.033699 132.433319,57.229469 136.959320,61.560425 C142.369537,66.737480 147.450333,72.263184 152.933594,77.358299 C159.257874,83.234879 168.218735,82.269463 174.124512,75.397751 C179.000198,69.724609 177.963394,59.285900 172.010803,54.743717 C166.161636,50.280441 156.321121,49.804379 151.045715,57.598484 C152.530945,58.699715 154.062195,59.835064 156.309082,60.797581 z" />
      <path d="M97.078156,147.075623 C101.231186,147.075241 104.946701,147.434784 108.543877,146.937820 C110.665436,146.644730 112.571022,144.933304 114.627243,143.974472 C116.142952,143.267670 117.738235,142.245010 119.310020,142.223175 C130.277039,142.070663 141.247177,142.142532 152.782059,142.142532 C152.782059,131.787659 152.782059,121.869469 152.782059,111.510376 C157.899124,111.510376 162.470276,111.510376 167.799332,111.510376 C167.799332,121.301567 167.799332,131.333130 167.799332,141.621262 C169.780273,141.824280 171.051758,142.043381 172.327316,142.070389 C178.872635,142.208984 179.734100,143.225845 178.722565,149.765686 C177.441330,158.049133 172.909485,161.922623 164.392242,161.924606 C121.735947,161.934540 79.079651,161.936432 36.423355,161.923950 C26.433815,161.921021 20.687525,155.312668 22.263397,145.335678 C22.454121,144.128174 24.311434,142.634033 25.657391,142.287918 C27.670603,141.770233 29.915476,142.153442 32.900452,142.153442 C32.900452,139.813156 32.900414,137.890900 32.900455,135.968628 C32.900959,112.974220 32.885002,89.979790 32.910549,66.985405 C32.920036,58.448029 36.467503,54.945507 45.078209,54.924053 C57.075218,54.894165 69.072372,54.905247 81.069412,54.927235 C82.525139,54.929901 83.980537,55.108723 85.854576,55.233845 C85.439819,60.101849 85.052666,64.645813 84.618538,69.741173 C72.618073,69.741173 60.698967,69.741173 48.233337,69.741173 C48.082882,71.829956 47.871334,73.412666 47.869633,74.995613 C47.847431,95.657234 47.969669,116.320045 47.760628,136.979568 C47.717510,141.241089 49.101288,142.348190 53.167393,142.227509 C62.323761,141.955719 71.493935,142.113235 80.657990,142.172379 C82.109695,142.181747 84.494614,142.134064 84.859306,142.884674 C87.484077,148.287079 92.242897,146.978348 97.078156,147.075623 z" />
    </svg>
  ),
  google: ({ className, ...props }: LucideProps) => (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="48px"
      height="48px"
      viewBox="0 0 48 48"
      enableBackground="new 0 0 48 48"
      className={cn("h-10 w-10", className)}
      {...props}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  ),
  pdf: (props: LucideProps) => (
    <svg
      stroke="#D82328"
      fill="#D82328"
      stroke-width="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V304H176c-35.3 0-64 28.7-64 64V512H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM176 352h32c30.9 0 56 25.1 56 56s-25.1 56-56 56H192v32c0 8.8-7.2 16-16 16s-16-7.2-16-16V448 368c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24H192v48h16zm96-80h32c26.5 0 48 21.5 48 48v64c0 26.5-21.5 48-48 48H304c-8.8 0-16-7.2-16-16V368c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H320v96h16zm80-112c0-8.8 7.2-16 16-16h48c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v32h32c8.8 0 16 7.2 16 16s-7.2 16-16 16H448v48c0 8.8-7.2 16-16 16s-16-7.2-16-16V432 368z"></path>
    </svg>
  ),
  web: (props: LucideProps) => (
    <svg
      stroke="currentColor"
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      stroke-linecap="round"
      stroke-linejoin="round"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"></path>
      <path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"></path>
      <path d="M12.5 3a16.989 16.989 0 0 1 1.828 4"></path>
      <path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"></path>
      <path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"></path>
      <path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"></path>
      <path d="M2 10l1 4l1.5 -4l1.5 4l1 -4"></path>
      <path d="M17 10l1 4l1.5 -4l1.5 4l1 -4"></path>
      <path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4"></path>
    </svg>
  ),
};
